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
import { PaginatedQuery, PaginatedQueryDoc } from 'src/libs/constants';
import { BookService } from '../services/book.service';
import { AddBookDto } from '../dto/AddBook.dto';
import { UpdateBookDto } from '../dto/UpdateBook.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiOperation({ summary: 'Create Book' })
  @Post('/')
  async createBook(@Body() addBookDto: AddBookDto) {
    const res = await this.bookService.createBook(addBookDto);
    return res;
  }

  @ApiOperation({ summary: 'Get All Books' })
  @ApiQuery({type: PaginatedQueryDoc})
  @Get('/')
  async getAllBooks(@Query() data: PaginatedQuery) {
    const res = await this.bookService.getAllPaginatedBooks(data);
    return res;
  }

  @ApiOperation({ summary: 'Get Book By ID' })
  @Get('/:id')
  async getBookById(@Param('id') id: string) {
    const res = await this.bookService.getBookById(id);
    return res;
  }

  @ApiOperation({ summary: 'Update Book' })
  @Put('/:id')
  async updateBook(@Param('id') id: string, @Body() addBookDto: UpdateBookDto) {
    const res = await this.bookService.updateBook(id, addBookDto);
    return res;
  }

  @ApiOperation({ summary: 'Delete Book' })
  @Delete('/:id')
  async deleteBook(@Param('id') id: string) {
    const res = await this.bookService.deleteBook(id);
    return res;
  }
}
