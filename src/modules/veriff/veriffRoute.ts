// Import only what we need from express
import * as Multipart from "connect-multiparty";
import { Router } from "express";
import { Middleware } from "../../middleware";
import { Validator } from "../../validate";
import { VeriffController } from "./veirffController";
import { VeriffMiddleware } from "./veriffMiddleware";
import { VeriffModel } from "./veriffModel";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const veriffController = new VeriffController();
const veriffMiddleware = new VeriffMiddleware();
const middleware = new Middleware();

const multipartMiddleware: Multipart = new Multipart({ maxFieldsSize: (20 * 1024 * 1024) });

router.post("/sign-up", veriffMiddleware.checkForUniqueEmail, v.validate(VeriffModel), veriffController.signup);

router.post("/sign-in", veriffMiddleware.checkForValidEmail, veriffController.login);

router.get("/", middleware.authenticateUser, veriffController.getUser);

router.post("/", middleware.authenticateUser, multipartMiddleware, veriffController.updateUser);

// Export the express.Router() instance to be used by server.ts
export const VeriffRoute: Router = router;
