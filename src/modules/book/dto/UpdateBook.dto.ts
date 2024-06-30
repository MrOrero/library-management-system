import { IsString, IsUUID, IsArray, IsNotEmpty, IsNumber, IsPositive, IsOptional } from "class-validator";
import { IsValidYear } from "src/libs/validation/isValidYear";

export class UpdateBookDto{
    @IsString()
    @IsOptional()
    title: string;

    @IsUUID()
    @IsOptional()
    authorId: string;

    @IsString()
    @IsValidYear()
    @IsOptional()
    publishedYear: string;

    @IsString()
    @IsOptional()
    genre: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    availableCopies: number;

}