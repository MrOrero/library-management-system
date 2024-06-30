import { IsString, IsUUID, MinLength, IsDateString } from "class-validator";

export class AddBorrowedRecordDto{
    @IsUUID()
    bookId: string;

    @IsString()
    @MinLength(3)
    borrower: string

    @IsDateString()
    borrowDate: string

    @IsDateString()
    returnDate: string

}