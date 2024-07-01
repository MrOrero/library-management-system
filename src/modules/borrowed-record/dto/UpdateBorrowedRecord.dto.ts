import { IsString, MinLength, IsDateString, IsOptional } from "class-validator";

export class UpdateBorrowedRecordDto{
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