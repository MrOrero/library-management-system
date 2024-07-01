import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsUUID, IsArray, IsNotEmpty, IsNumber, IsPositive, IsOptional } from "class-validator";
import { IsValidYear } from "src/libs/validation/isValidYear";

export class UpdateBookDto{
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    title: string;

    @IsUUID()
    @IsOptional()
    @ApiPropertyOptional()
    authorId: string;

    @IsString()
    @IsValidYear()
    @IsOptional()
    @ApiPropertyOptional()
    publishedYear: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    genre: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiPropertyOptional()
    availableCopies: number;

}