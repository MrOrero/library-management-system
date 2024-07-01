import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MinLength, IsDateString, IsOptional } from "class-validator";

export class UpdateAuthorDto{
    @IsString()
    @MinLength(3)
    @IsOptional()
    @ApiPropertyOptional()
    name: string;
  
    @IsDateString()
    @IsOptional()
    @ApiPropertyOptional()
    birthdate: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    @ApiPropertyOptional()
    bio: string;

}