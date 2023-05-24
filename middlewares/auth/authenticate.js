const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

  try {
    const token = req.headers.access_token;
    if (!token) {
      return res.status(403).json({ message: "Vui lòng đăng nhập!", isSuccess: false });
    }
    const data = jwt.verify(token, "hehehe");
    req.phone = data.phone;





    return next();
  } catch {
    return res.status(403).json({ message: "Vui lòng đăng nhập!", isSuccess: false });
  }
}

module.exports = {
  authenticate,
}