import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginatedQuery, PaginatedQueryDoc } from '../../../libs/constants';
import { BookService } from '../services/book.service';
import { AddBookDto } from '../dto/AddBook.dto';
import { UpdateBookDto } from '../dto/UpdateBook.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../libs/common/guards/auth.guard';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Book' })
  @Put('/:id')
  async updateBook(@Param('id') id: string, @Body() addBookDto: UpdateBookDto) {
    const res = await this.bookService.updateBook(id, addBookDto);
    return res;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Book' })
  @Delete('/:id')
  async deleteBook(@Param('id') id: string) {
    const res = await this.bookService.deleteBook(id);
    return res;
  }
}
