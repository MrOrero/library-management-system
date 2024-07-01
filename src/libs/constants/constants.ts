import {  ApiPropertyOptional } from "@nestjs/swagger";

export const UNIT_OF_WORK_PROVIDER = "unit_of_work";

export const CREATED_AT_COLUMN = "createdAt";


export enum InjectionTokens {
    AUTHOR_REPOSITORY = "author_repository",
    BOOK_REPOSITORY = "book_repository",
    BORROWED_RECORD_REPOSITORY = "borrowed_record_repository",
}
  
export class PaginatedQueryDoc {
    @ApiPropertyOptional()
    page?: number;
    @ApiPropertyOptional()
    size?: number;
    @ApiPropertyOptional()
    filter?: string;
    @ApiPropertyOptional()
    filterBy?: string;
    @ApiPropertyOptional()
    order?: "asc" | "desc";
    @ApiPropertyOptional()
    orderBy?: string;
}

export interface PaginatedQuery {
    page?: number;
    size?: number;
    filter?: string;
    filterBy?: string;
    order?: "asc" | "desc";
    orderBy?: string;
}