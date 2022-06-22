import * as dotenv from "dotenv";
import * as l10n from "jm-ez-l10n";
import * as uuid from "node-uuid";
import * as crypto from "crypto";
const request = require('request');

export class Veriff {

    // start veriff verification
    public static async start(payload:any) {
        return new Promise(async(resolve, reject) => {
          // fetch uuid and timestamp
          payload.verification.callback = process.env.VERIFF_CALLBACK_URL;
          payload.verification.vendorData = uuid.v4();
          payload.verification.timestamp = new Date().toISOString();
            
          // options to set
          const requestURL = `${process.env.VERIFF_BASE_URL}/v1/sessions`;
          const options = await this.setOptionsData(requestURL, 'POST', JSON.stringify(payload), {});
          request(options, async (error, response, body) => {
              if (response) {
                  if (response.body) {
                      resolve({
                          data: JSON.parse(response.body),
                      });
                  }
              } else {
                console.log(`start error : ${error}`);
                reject(error);
              }
          });
        });
    }

    // get list of attemptes
    public static async attempts(sessionId:any) {
        return new Promise(async(resolve, reject) => {
            // options to set
            const requestURL = `${process.env.VERIFF_BASE_URL}/v1/sessions/${sessionId}/attempts`;
            const options = await this.setOptionsData(requestURL, 'GET', "", {key : sessionId});
            request(options, async (error, response, body) => {
                if (response) {
                    if (response.body) {
                        resolve({
                            data: JSON.parse(response.body),
                        });
                    }
                } else {
                    console.log(`start error : ${error}`);
                    reject(error);
                }
            });
        });
    }

    // static option data
    static async setOptionsData(url:any, method:any, payload:any, hmac_signature:any) {
        let headers;
        if(hmac_signature && Object.keys(hmac_signature).length > 0) {
            headers = {
                'x-auth-client': `${process.env.VERIFF_PUBLISHABLE_KEY}`,
                'X-HMAC-SIGNATURE': await this.generateOneKeySignature(hmac_signature.key, process.env.VERIFF_PRIVATE_KEY),
                'content-type':'application/json'
            };
        } else {
            headers = {
               'x-auth-client': `${process.env.VERIFF_PUBLISHABLE_KEY}`,
               'content-type':'application/json'
            };
        }
        const options = { method, headers, url, body:payload };
        return options;
    }

    // Generate hmac for single key
    static async generateOneKeySignature( sessionKey: any, secretKey:any ) {
        return crypto
                    .createHmac('sha256', secretKey)
                    .update(Buffer.from(sessionKey, 'utf8'))
                    .digest('hex')
                    .toLowerCase();
    }

    // generate signature data
    static async generateSignature(payload:any, secret:any) {
        // check if it's object
        if (payload.constructor === Object) {
            payload = JSON.stringify(payload);
        }
        
        // check if it's Buffer
        if (payload.constructor !== Buffer) {
            payload = Buffer.from(payload, 'utf8');
        }

        const signature = crypto.createHash('sha256');
        signature.update(payload);
        signature.update(Buffer.from(secret, 'utf8'));
        
        return signature.digest('hex');
    }

    // check signature valid or not
    static async isSignatureValid(data: any) {
        const { signature, secret } = data;
        let { payload } = data;
        
        if (data.payload.constructor === Object) {
            payload = JSON.stringify(data.payload);
        }
        if (payload.constructor !== Buffer) {
            payload = Buffer.from(payload, 'utf8');
        }
        const hash = crypto.createHash('sha256');
        hash.update(payload);
        hash.update(Buffer.from(secret));
        const digest = hash.digest('hex');
        console.log("digest value is :: ", digest);
        console.log("signature.toLowerCase() value is :: ", signature.toLowerCase());
        return digest === signature.toLowerCase();
    }
}