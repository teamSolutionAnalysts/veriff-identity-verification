import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Constants } from "../../config/constants";
import { Log } from "../../helpers/logger";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import { User } from "../../helpers/user";

import {isEmpty} from "lodash";
import { async } from "q";
import { UserUtils } from "./userUtils";

export class UserController {
  private userUtils: UserUtils = new UserUtils();
  private user: User = new User();
  private logger: any = Log.getLogger();

  public signup = async (req: Request, res: Response) => {
    const { password, email, fullName } = req.body;
    const encryptedPassword = bcryptjs.hashSync(password, 12);
    const userDetail =  { email, fullName, password: encryptedPassword };
    const result: ResponseBuilder = await this.userUtils.createUser(userDetail);

    res.status(result.code).json(ResponseBuilder.data(result.result, req.t("SUCCESS")));
  }

  public login = async (req: Request, res: Response) => {
    const user = req.user;
    if (bcryptjs.compareSync(req.body.password, user.password)) {
      const userDetail = {
        id: user.id,
      };
      res.status(200).json(ResponseBuilder.data(userDetail, req.t("SUCCESS")));
    } else {
      return res.status(400).json(ResponseBuilder.errorMessage(req.t("ERR_INVALID_PASSWORD")));
    }

  }

  public getUser = async (req: Request, res: Response) => {
    if (!isEmpty(req._user)) {
      const userData = req._user;
      return res.status(200).json(ResponseBuilder.data(userData, req.t("SUCCESS")));
    } else {
      return res.status(500).json(ResponseBuilder.errorMessage(req.t("ERR_TOKEN_EXP")));
    }
  }

  public updateUser = async (req: Request, res: Response) => {
    const { fullName } = req.body;
    const { id } = req._user;
    const result = await this.userUtils.updateUser({ fullName }, id);

    if (result && result.result ) {
      return res.status(200).json(ResponseBuilder.data(result.result, req.t("SUCCESS")));
    }  else {
      return res.status(400).json(ResponseBuilder.errorMessage(req.t("FAILED")));
    }

  }
}
