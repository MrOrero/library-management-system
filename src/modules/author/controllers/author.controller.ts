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
import { PaginatedQuery, PaginatedQueryDoc } from 'src/libs/constants';
import { UpdateAuthorDto } from '../dto/UpdateAuthor.dto';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @ApiOperation({ summary: 'Create Author' })
  @Post('/')
  async createAuthor(@Body() authorDto: CreateAuthorDto) {
    const res = await this.authorService.createAuthor(authorDto);
    return res;
  }

  @ApiOperation({ summary: 'Get All Authors' })
  @ApiQuery({type: PaginatedQueryDoc})
  @Get('/')
  async getAllAuthors(@Query() data: PaginatedQuery) {
    const res = await this.authorService.getAllPaginatedAuthors(data);
    return res;
  }

  @ApiOperation({ summary: 'Get Author By ID' })
  @Get('/:id')
  async getAuthorById(@Param('id') id: string) {
    const res = await this.authorService.getAuthorById(id);
    return res;
  }

  @ApiOperation({ summary: 'Update Author' })
  @Put('/:id')
  async updateAuthor(
    @Param('id') id: string,
    @Body() authorDto: UpdateAuthorDto,
  ) {
    const res = await this.authorService.updateAuthor(id, authorDto);
    return res;
  }

  @ApiOperation({ summary: 'Delete Author' })
  @Delete('/:id')
  async deleteAuthor(@Param('id') id: string) {
    const res = await this.authorService.deleteAuthor(id);
    return res;
  }
}
