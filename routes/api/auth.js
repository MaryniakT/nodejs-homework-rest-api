const express = require('express');

const { validateBody, authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/auth");
const { schemas }  = require("../../models/users");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post("/login", validateBody(schemas.registerSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch(
    "/",
    authenticate,
    validateBody(schemas.loginSchema),
    ctrl.updateSubscriptionUser
  );

  router.post("/logout", authenticate, ctrl.logout);

module.exports = router;