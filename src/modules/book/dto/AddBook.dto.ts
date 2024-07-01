import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsNumber, IsPositive } from "class-validator";
import { IsValidYear } from "../../../libs/validation/isValidYear";

export class AddBookDto{
    @IsString()
    @ApiProperty()
    title: string;

    @IsUUID()
    @ApiProperty()
    authorId: string;

    @IsString()
    @IsValidYear()
    @ApiProperty()
    publishedYear: string;

    @IsString()
    @ApiProperty()
    genre: string;

    @IsNumber()
    @IsPositive()
    @ApiProperty()
    availableCopies: number;

}