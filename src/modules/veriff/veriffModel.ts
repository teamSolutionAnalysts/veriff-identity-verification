import {
  IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumberString, IsPositive, MaxLength, MinLength,
} from "class-validator";
import { Model } from "../../model";

export class VeriffModel extends Model {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  public fullName: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;

  constructor(body: any) {
    super();
    const {
      fullName,
      email,
      password,
    } = body;

    this.fullName = fullName;
    this.email = email;
    this.password = password;

  }
}
