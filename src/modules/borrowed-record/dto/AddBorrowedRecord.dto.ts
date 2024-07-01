import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, MinLength, IsDateString } from "class-validator";

export class AddBorrowedRecordDto{
    @IsUUID()
    @ApiProperty()
    bookId: string;

    @IsString()
    @MinLength(3)
    @ApiProperty()
    borrower: string

    @IsDateString()
    @ApiProperty()
    borrowDate: string

    @IsDateString()
    @ApiProperty()
    returnDate: string

}