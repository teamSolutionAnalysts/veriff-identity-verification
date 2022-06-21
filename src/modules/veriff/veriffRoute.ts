// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../validate";
import { VeriffController } from "./veirffController";
import { VeriffModel } from "./veriffModel";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const veriffController = new VeriffController();

router.post("/sessions", v.validate(VeriffModel), veriffController.createSession);

router.get("/:sessionId/attempts", veriffController.getVeriffDetails);

router.post("/veriff-decision", veriffController.veriffDecision);


// Export the express.Router() instance to be used by server.ts
export const VeriffRoute: Router = router;
