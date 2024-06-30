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
import { AuthorService } from '../services/author.service';
import { CreateAuthorDto } from '../dto/CreateAuthor.dto';
import { PaginatedQuery } from 'src/libs/constants';
import { UpdateAuthorDto } from '../dto/UpdateAuthor.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('/')
  async createAuthor(@Body() authorDto: CreateAuthorDto) {
    const res = await this.authorService.createAuthor(authorDto);
    return res;
  }

  @Get('/')
  async getAllAuthors(@Query() data: PaginatedQuery) {
    const res = await this.authorService.getAllPaginatedAuthors(data);
    return res;
  }

  @Get('/:id')
  async getAuthorById(@Param('id') id: string) {
    const res = await this.authorService.getAuthorById(id);
    return res;
  }

  @Put('/:id')
  async updateAuthor(
    @Param('id') id: string,
    @Body() authorDto: UpdateAuthorDto,
  ) {
    const res = await this.authorService.updateAuthor(id, authorDto);
    return res;
  }

  @Delete('/:id')
  async deleteAuthor(@Param('id') id: string) {
    const res = await this.authorService.deleteAuthor(id);
    return res;
  }
}
