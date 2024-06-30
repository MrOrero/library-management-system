import { IsString, IsUUID, IsNumber, IsPositive } from "class-validator";
import { IsValidYear } from "src/libs/validation/isValidYear";

export class AddBookDto{
    @IsString()
    title: string;

    @IsUUID()
    authorId: string;

    @IsString()
    @IsValidYear()
    publishedYear: string;

    @IsString()
    genre: string;

    @IsNumber()
    @IsPositive()
    availableCopies: number;

}