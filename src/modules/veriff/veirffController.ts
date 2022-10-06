import bcryptjs = require("bcryptjs");
import { Request, Response } from "express";
import { Constants } from "../../config/constants";
import { Log } from "../../helpers/logger";
import { ResponseBuilder } from "../../helpers/responseBuilder";
import {isEmpty} from "lodash";
import { Veriff } from "./veriffUtils";

export class VeriffController {

  // create veriff session
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

  // get veriff details
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

  // To handle the veriff webhook response
  public verificationWebhook = async (req: Request, res: Response) => {
    const signature = req.get('x-signature');
    const secret = process.env.VERIFF_PRIVATE_KEY;
    const payload = req.body;

    console.log('Received a webhook');
    console.log('Validated signature:', Veriff.isSignatureValid({ signature, secret, payload }));
    console.log('Payload', JSON.stringify(payload, null, 4));
    res.json({ status: 'success' });
  }
}
