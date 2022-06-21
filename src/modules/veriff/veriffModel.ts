import {
  IsNotEmpty, MaxLength, MinLength
} from "class-validator";
import { Model } from "../../model";

export class VeriffModel extends Model {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  public firstName: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  public lastName: string;

  constructor(body: any) {
    super();
    const {
      firstName,
      lastName,
    } = body;

    this.firstName = firstName;
    this.lastName = lastName;
  }
}
