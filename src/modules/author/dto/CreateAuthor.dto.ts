import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsDateString } from "class-validator";

export class CreateAuthorDto{
    @IsString()
    @MinLength(3)
    @ApiProperty()
    name: string;
  
    @IsDateString()
    @ApiProperty()
    birthdate: string;

    @IsString()
    @MinLength(3)
    @ApiProperty()
    bio: string;

}