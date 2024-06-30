import { IsString, MinLength, IsEmail, IsPhoneNumber, IsNumber, IsEnum, IsNumberString, MaxLength, IsDateString, IsOptional } from "class-validator";

export class UpdateAuthorDto{
    @IsString()
    @MinLength(3)
    @IsOptional()
    name: string;
  
    @IsDateString()
    @IsOptional()
    birthdate: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    bio: string;

}