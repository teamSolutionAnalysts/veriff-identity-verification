import * as sql from "jm-ez-mysql";
import * as _ from "lodash";
import { Tables } from "./config/tables";
import { Encrypt } from "./helpers/encrypt";
import { ResponseBuilder } from "./helpers/responseBuilder";
import { User } from "./helpers/user";

export class Middleware {

  private user: User = new User();
  private encryptUtil: Encrypt = new Encrypt();

  public authenticateUser = async (req, res, next: () => void) => {

    if (req.headers.authorization && !_.isEmpty(req.headers.authorization)) {
        return res.status(401).json(ResponseBuilder.errorMessage(req.t("ERR_UNAUTH")));
      
    } else {
      return res.status(401).json(ResponseBuilder.errorMessage(req.t("ERR_UNAUTH")));
    }
  }
}
