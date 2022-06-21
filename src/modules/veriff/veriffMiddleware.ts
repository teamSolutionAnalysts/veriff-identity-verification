import { Validator } from "class-validator";
import * as sql from "jm-ez-mysql";
import { isEmpty } from "lodash";
import { Constants } from "../../config/constants";
import { Tables } from "../../config/tables";
import { ResponseBuilder } from "../../helpers/responseBuilder";

export class VeriffMiddleware {
  public checkForUniqueEmail = async (req, res, next) => {
    const { email } = req.body;
    const result = await sql.first(`${Tables.USER}`, ["id"], `email='${email}'`);
    if (result) {
      return res.status(400).json(ResponseBuilder.errorMessage(req.t("ERR_EMAIL_ALREADY_USED")));
    } else {
      next();
    }
  }

  public checkForValidEmail = async (req, res, next) => {
    const { email } = req.body;
    const validator = new Validator();
    if (email && !isEmpty(email)) {
      return res.status(400).json(ResponseBuilder.errorMessage(req.t("ERR_EMAIL_IS_NOT_VALID")));
    } else {
      return res.status(400).json(ResponseBuilder.errorMessage(req.t("ERR_EMAIL_IS_NOT_VALID")));
    }
  }
}
