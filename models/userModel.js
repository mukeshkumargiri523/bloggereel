const { Schema, default: mongoose } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication.js");
const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: "/images/default_pp.png" },
    salt: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(10).toString();
  //   const salt = "baeffFDRTG";
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});
userSchema.static("matchPasswordAndGenToken", async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");
    const salt = user.salt;
    const hashedPassword = user.password;
    const userPorvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== userPorvidedHash) {
      throw new Error("Incorrect password");
    }
    const token = await createTokenForUser(user);
    return token;
  } catch (err) {
    console.log("match pass ", err);
  }
});

exports.User = mongoose.model("User", userSchema);
