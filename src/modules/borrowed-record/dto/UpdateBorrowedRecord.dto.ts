import { IsString, IsUUID, MinLength, IsDateString, IsOptional } from "class-validator";

export class UpdateBorrowedRecordDto{
    @IsUUID()
    @IsOptional()
    bookId: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    borrower: string

    @IsDateString()
    @IsOptional()
    borrowDate: string

    @IsDateString()
    @IsOptional()
    returnDate: string

}