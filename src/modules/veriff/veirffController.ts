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
    const { sessionId } = req.params;
    const veriffResponse:any = await Veriff.attempts(sessionId);
    // Veriff response with status
    if(veriffResponse && veriffResponse.data && veriffResponse.data.status == Constants.VERIFF_STATUS.SUCCESS){
      return res.status(Constants.SUCCESS_CODE).json({ message: req.t("VERIFF_STARTED"), result : veriffResponse.data.verifications });
    } else {
      console.log(veriffResponse)
      return res.status(Constants.FAIL_CODE).json(ResponseBuilder.errorMessage(veriffResponse.message));
    }
  }

  public veriffDecision = async (req: Request, res: Response) => {
    
  }
}
