import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MinLength, IsDateString, IsOptional } from "class-validator";

export class UpdateBorrowedRecordDto{
    @IsString()
    @MinLength(3)
    @IsOptional()
    @ApiPropertyOptional()
    borrower: string

    @IsDateString()
    @IsOptional()
    @ApiPropertyOptional()
    borrowDate: string

    @IsDateString()
    @IsOptional()
    @ApiPropertyOptional()
    returnDate: string

}