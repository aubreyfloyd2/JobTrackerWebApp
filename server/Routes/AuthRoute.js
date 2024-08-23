const { Signup, Login, Logout } = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.get("/auth/check", userVerification);
router.post("/signup", Signup);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/verify',userVerification);

module.exports = router;
