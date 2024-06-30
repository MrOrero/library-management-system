import { IsString, MinLength, IsDateString } from "class-validator";

export class CreateAuthorDto{
    @IsString()
    @MinLength(3)
    name: string;
  
    @IsDateString()
    birthdate: string;

    @IsString()
    @MinLength(3)
    bio: string;

}