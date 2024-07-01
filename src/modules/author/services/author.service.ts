import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectionTokens, PaginatedQuery } from '../../../libs/constants';
import { AuthorRepository } from '../repository/author.repository';
import { CreateAuthorDto } from '../dto/CreateAuthor.dto';
import { AuthorDomain } from '../domain/author.domain';
import { AuthorMapper } from '../mappers/author.mapper';
import { handleErrorCatch } from '../../../libs/common/utils/helper';
import { UpdateAuthorDto } from '../dto/UpdateAuthor.dto';

@Injectable()
export class AuthorService {
  @Inject(InjectionTokens.AUTHOR_REPOSITORY)
  private readonly authorRepository: AuthorRepository;

  async createAuthor(dto: CreateAuthorDto) {
    try {
      const authorOrError = AuthorDomain.create(dto);

      if (authorOrError.isFailure) {
        throw new BadRequestException(authorOrError.errorValue());
      }

      const authorDomain = authorOrError.getValue();

      const author = AuthorMapper.toPersistence(authorDomain);

      const res = await this.authorRepository.save(author);
      return res;
    } catch (error) {
      handleErrorCatch(error, 'Create Author');
    }
  }

  async getAllPaginatedAuthors(data: PaginatedQuery) {
    try {
      return await this.authorRepository.findPaginated(data);
    } catch (error) {
      handleErrorCatch(error, 'Get All Paginated Authors');
    }
  }

  async getAuthorById(id: string) {
    try {
      const authorExists = await this.authorRepository.exists({ id });

      if (!authorExists) {
        throw new NotFoundException('Author Not Found');
      }

      return this.authorRepository.findOne({ id }, {books: true});
    } catch (error) {
      handleErrorCatch(error, 'Get Author By ID');
    }
  }

  async updateAuthor(id: string, dto: UpdateAuthorDto) {
    try {
      const authorExists = await this.authorRepository.exists({ id });

      if (!authorExists) {
        throw new NotFoundException('Author Not Found');
      }

      return this.authorRepository.findOneAndUpdate(
        { id },
        {
          ...dto,
        },
      );
    } catch (error) {
      handleErrorCatch(error, 'Update Author');
    }
  }

  async deleteAuthor(id: string) {
    try {
      const authorExists = await this.authorRepository.exists({ id });

      if (!authorExists) {
        throw new NotFoundException('Author Not Found');
      }
      return this.authorRepository.findOneAndDelete({ id });
    } catch (error) {
      handleErrorCatch(error, 'Delete Author');
    }
  }
}
