import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginatedQuery } from 'src/libs/constants';
import { BookService } from '../services/book.service';
import { AddBookDto } from '../dto/AddBook.dto';
import { UpdateBookDto } from '../dto/UpdateBook.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('/')
  async createAuthor(@Body() addBookDto: AddBookDto) {
    const res = await this.bookService.createBook(addBookDto);
    return res;
  }

  @Get('/')
  async getAllBooks(@Query() data: PaginatedQuery) {
    const res = await this.bookService.getAllPaginatedBooks(data);
    return res;
  }

  @Get('/:id')
  async getBookById(@Param('id') id: string) {
    const res = await this.bookService.getBookById(id);
    return res;
  }

  @Put('/:id')
  async updateBook(@Param('id') id: string, @Body() addBookDto: UpdateBookDto) {
    const res = await this.bookService.updateBook(id, addBookDto);
    return res;
  }

  @Delete('/:id')
  async deleteBook(@Param('id') id: string) {
    const res = await this.bookService.deleteBook(id);
    return res;
  }
}
