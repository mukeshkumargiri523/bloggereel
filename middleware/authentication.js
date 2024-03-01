const { validateToken } = require("../services/authentication");

function checkForAuthentictaionCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req?.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (err) {
      console.log(err);
    }
    return next();
  };
}

module.exports = { checkForAuthentictaionCookie };
