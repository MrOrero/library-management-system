import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectionTokens, PaginatedQuery } from 'src/libs/constants';
import { handleErrorCatch } from 'src/libs/domain/utils/helper';
import { BookRepository } from '../repository/book.repository';
import { AddBookDto } from '../dto/AddBook.dto';
import { BookDomain } from '../domain/book.domain';
import { BookMapper } from '../mappers/book.mapper';
import { UpdateBookDto } from '../dto/UpdateBook.dto';

@Injectable()
export class BookService {
  @Inject(InjectionTokens.BOOK_REPOSITORY)
  private readonly bookRepository: BookRepository;

  async createBook(dto: AddBookDto) {
    try {
      const bookOrError = BookDomain.create(dto);

      if (bookOrError.isFailure) {
        throw new BadRequestException(bookOrError.errorValue());
      }

      const bookDomain = bookOrError.getValue();

      const book = BookMapper.toPersistence(bookDomain);

      const res = await this.bookRepository.save(book);
      return res;
    } catch (error) {
      handleErrorCatch(error, 'Create Book');
    }
  }

  async getAllPaginatedBooks(data: PaginatedQuery) {
    try {
      return await this.bookRepository.findPaginated(data,{}, {}, {author: true});
    } catch (error) {
      handleErrorCatch(error, 'Get All Paginated Books');
    }
  }

  async getBookById(id: string) {
    try {
      const bookExists = await this.bookRepository.exists({ id });
      if (!bookExists) {
        throw new BadRequestException('Book Not Found');
      }

      return this.bookRepository.findOne({ id }, {
        author: true,
      });
    } catch (error) {
      handleErrorCatch(error, 'Get Book By ID');
    }
  }

  async updateBook(id: string, dto: UpdateBookDto) {
    try {
      const bookExists = await this.bookRepository.exists({ id });

      if (!bookExists) {
        throw new BadRequestException('Book Not Found');
      }

      return this.bookRepository.findOneAndUpdate(
        { id },
        {
          ...dto,
        },
      );
    } catch (error) {
      handleErrorCatch(error, 'Update Book');
    }
  }

  async deleteBook(id: string) {
    try {
      const bookExists = await this.bookRepository.exists({ id });

      if (!bookExists) {
        throw new BadRequestException('Book Not Found');
      }
      return this.bookRepository.findOneAndDelete({ id });
    } catch (error) {
      handleErrorCatch(error, 'Delete Book');
    }
  }
}
