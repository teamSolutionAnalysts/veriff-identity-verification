import * as sql from "jm-ez-mysql";
import { Constants } from "../../config/constants";
import { Tables } from "../../config/tables";
import { Dates } from "../../helpers/date";
import { Log } from "../../helpers/logger";
import { ResponseBuilder } from "../../helpers/responseBuilder";

export class UserUtils {
  private dateUtils: Dates = new Dates();
  private logger: any = Log.getLogger();
  public async createUser(userDetail): Promise<ResponseBuilder> {
      const user = await sql.insert(`${Tables.USER}`, userDetail);
      if (user.insertId) {
        return ResponseBuilder.data({userId: user.insertId});
      } else {
        ResponseBuilder.error(user.message);
      }
  }

  public async updateUser(userData, userId): Promise<ResponseBuilder> {
      const updateRes = await sql.update(`${Tables.USER}`, userData, "id = ?", [userId]);
      return ResponseBuilder.data(userData);
  }
}
