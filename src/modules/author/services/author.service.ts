import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectionTokens, PaginatedQuery } from 'src/libs/constants';
import { AuthorRepository } from '../repository/author.repository';
import { CreateAuthorDto } from '../dto/CreateAuthor.dto';
import { AuthorDomain } from '../domain/author.domain';
import { AuthorMapper } from '../mappers/author.mapper';
import { handleErrorCatch } from 'src/libs/domain/utils/helper';
import { UpdateAuthorDto } from '../dto/UpdateAuthor.dto';

@Injectable()
export class AuthorService {
  @Inject(InjectionTokens.AUTHOR_REPOSITORY)
  private readonly authorRepository: AuthorRepository;

  async createAuthor(dto: CreateAuthorDto) {
    try {
      const authorExists = await this.authorRepository.exists({
        name: dto.name,
      });

      if (authorExists) {
        throw new BadRequestException('Author Already Exists');
      }
      const authorOrError = AuthorDomain.create(dto);

      if (authorOrError.isFailure) {
        throw new BadRequestException(authorOrError.errorValue());
      }

      const authorDomain = authorOrError.getValue();

      const author = AuthorMapper.toPersistence(authorDomain);

      const res = await this.authorRepository.save(author);
      return res;
    } catch (error) {
      handleErrorCatch(error, 'Create Vendor');
    }
  }

  async getAllPaginatedAuthors(data: PaginatedQuery) {
    try {
      return await this.authorRepository.findPaginated(data);
    } catch (error) {
      handleErrorCatch(error, 'Get All Paginated Vendors');
    }
  }

  async getAuthorById(id: string) {
    try {
      const authorExists = await this.authorRepository.exists({ id });

      if (!authorExists) {
        throw new BadRequestException('Author Not Found');
      }

      return this.authorRepository.findOne({ id });
    } catch (error) {
      handleErrorCatch(error, 'Get Vendor By ID');
    }
  }

  async updateAuthor(id: string, dto: UpdateAuthorDto) {
    try {
      const authorExists = await this.authorRepository.exists({ id });

      if (!authorExists) {
        throw new BadRequestException('Author Not Found');
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
        throw new BadRequestException('Author Not Found');
      }
      return this.authorRepository.findOneAndDelete({ id });
    } catch (error) {
      handleErrorCatch(error, 'Delete Author');
    }
  }
}
