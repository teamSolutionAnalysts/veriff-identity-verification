
import * as l10n from "jm-ez-l10n";
import * as sql from "jm-ez-mysql";
import { Tables } from "../config/tables";
import { Failure } from "./error";
import { Log } from "./logger";
import { ResponseBuilder } from "./responseBuilder";

export class User {
  private logger: any = Log.getLogger();
  public async getUserDetails(userId) {
    try {
      const params = ["id", "fullName", "email"];
      const condition = `id = ?`;

      // TODO :: User verificaiton should be done here
      const result = await sql.first(Tables.USER, params, condition, userId);
      if (result && result.id) {
        return result;
      }
      throw new Failure(l10n.t("ERR_NO_USER_FOUND"), "No user found.");
    } catch (error) {
      this.logger.error(error);
      throw ResponseBuilder.errorMessage(error);
    }
  }
}
