// Import only what we need from express
import * as Multipart from "connect-multiparty";
import { Router } from "express";
import { Middleware } from "../../middleware";
import { Validator } from "../../validate";
import { UserController } from "./userController";
import { UserMiddleware } from "./userMiddleware";
import { UserModel } from "./userModel";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const userController = new UserController();
const userMiddleware = new UserMiddleware();
const middleware = new Middleware();

const multipartMiddleware: Multipart = new Multipart({ maxFieldsSize: (20 * 1024 * 1024) });

router.post("/sign-up", userMiddleware.checkForUniqueEmail, v.validate(UserModel), userController.signup);

router.post("/sign-in", userMiddleware.checkForValidEmail, userController.login);

router.get("/", middleware.authenticateUser, userController.getUser);

router.post("/", middleware.authenticateUser, multipartMiddleware, userController.updateUser);

// router.use(multipartMiddleware);

// Export the express.Router() instance to be used by server.ts
export const UserRoute: Router = router;
