const { Schema, default: mongoose } = require("mongoose");
const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    coverImageUrl: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

exports.Blog = mongoose.model("Blog", blogSchema);
