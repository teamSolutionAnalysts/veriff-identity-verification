import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Constants } from "../../config/constants";
import { Log } from "../../helpers/logger";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import {isEmpty} from "lodash";
import { Veriff } from "./veriffUtils";

export class VeriffController {
  private veriffUtils: Veriff = new Veriff();
  private logger: any = Log.getLogger();

  public createSession = async (req: Request, res: Response) => {
    const { firstName, lastName } = req.body;
    
    const payload = {
      verification: {
        person: {
          firstName: firstName,
          lastName: lastName,
        },
      }
    };
    const veriffResponse:any = await Veriff.start(payload);
 
    // Veriff response with status
    if(veriffResponse && veriffResponse.data && veriffResponse.data.status == Constants.VERIFF_STATUS.SUCCESS){
      const response = {
        sessionId:veriffResponse.data.verification.id,
        sessionURL:veriffResponse.data.verification.url, 
        vendorId:veriffResponse.data.verification.vendorData, 
        sessionToken:veriffResponse.data.verification.sessionToken,
        status: veriffResponse.data.verification.status,
      }

      return res.status(Constants.SUCCESS_CODE).json({ message: req.t("VERIFF_STARTED"), result : response });
    } else {
      return res.status(Constants.FAIL_CODE).json(ResponseBuilder.errorMessage(veriffResponse.message));
    }
  }

  public getVeriffDetails = async (req: Request, res: Response) => {
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

  public veriffDecision = async (req: Request, res: Response) => {
    if (!isEmpty(req._user)) {
      const userData = req._user;
      return res.status(200).json(ResponseBuilder.data(userData, req.t("SUCCESS")));
    } else {
      return res.status(500).json(ResponseBuilder.errorMessage(req.t("ERR_TOKEN_EXP")));
    }
  }
}
