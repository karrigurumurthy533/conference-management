const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { validateRegister,validateLogin } = require("../validations/authValidation");

const router = express.Router();


router.post("/register",validateRegister,authController.register);
router.post("/login",validateLogin,authController.login);
router.post("/employee/login", authController.employeeLogin);
router.post("/employee/logout", authController.employeeLogout);
router.put("/profile",authMiddleware(),authController.updateProfile);
router.post("/logout",authMiddleware(),authController.logout);



module.exports = router;