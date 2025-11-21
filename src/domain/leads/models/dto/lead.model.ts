import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LeadModel {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
