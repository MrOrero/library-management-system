import { Test, TestingModule } from '@nestjs/testing';
import { AddBookDto } from '../dto/AddBook.dto';
import { UpdateBookDto } from '../dto/UpdateBook.dto';
import { BookDomain } from '../domain/book.domain';
import { BookMapper } from '../mappers/book.mapper';
import { BookService } from '../services/book.service';
import { InjectionTokens } from '../../../libs/constants';

class MockBookRepository {
  save = jest.fn();
  findPaginated = jest.fn();
  exists = jest.fn();
  findOne = jest.fn();
  findOneAndUpdate = jest.fn();
  findOneAndDelete = jest.fn();
}

describe('BookService', () => {
  let service: BookService;
  let repository: MockBookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: InjectionTokens.BOOK_REPOSITORY,
          useClass: MockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    repository = module.get<MockBookRepository>(
      InjectionTokens.BOOK_REPOSITORY,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBook', () => {
    it('should create a book successfully', async () => {
      const addBookDto: AddBookDto = {
        title: 'Sample Book',
        authorId: '00000000-0000-0000-0000-000000000000',
        genre: 'Fiction',
        availableCopies: 10,
        publishedYear: '2021',
      };

      const bookDomain = BookDomain.create(addBookDto).getValue();
      const book = BookMapper.toPersistence(bookDomain);

      repository.save.mockResolvedValue(book);

      const result = await service.createBook(addBookDto);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('title', book.title);
      expect(result).toHaveProperty('authorId', book.authorId);
      expect(result).toHaveProperty('id');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if Invalid data is used', async () => {
      const addBookDto: AddBookDto = {
        title: 'Invalid Book',
        authorId: '5',
        genre: 'Fiction',
        availableCopies: 10,
        publishedYear: '2021',
      };

      jest.spyOn(BookDomain, 'create').mockReturnValue({
        isFailure: true,
        errorValue: () => 'Invalid data',
        getValue: jest.fn(),
      } as any);

      try {
        await service.createBook(addBookDto);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Invalid data');
      }
    });
  });

  describe('getAllPaginatedBooks', () => {
    it('should return paginated books', async () => {
      const paginatedQuery = { page: 1, limit: 10 };
      const paginatedResult = { items: [], total: 0 };

      repository.findPaginated.mockResolvedValue(paginatedResult);

      const result = await service.getAllPaginatedBooks(paginatedQuery);

      expect(result).toEqual(paginatedResult);
      expect(repository.findPaginated).toHaveBeenCalledWith(paginatedQuery, {}, {}, { author: true });
    });
  });

  describe('getBookById', () => {
    it('should return a book by ID', async () => {
      const id = '1';
      const book = {
        id,
        title: 'Sample Book',
        authorId: '1',
        publishedDate: '2022-01-01',
        genre: 'Fiction',
        summary: 'A sample book summary',
        author: {},
      };

      repository.exists.mockResolvedValue(true);
      repository.findOne.mockResolvedValue(book);

      const result = await service.getBookById(id);

      expect(result).toEqual(book);
      expect(repository.exists).toHaveBeenCalledWith({ id });
      expect(repository.findOne).toHaveBeenCalledWith({ id }, { author: true });
    });

    it('should throw NotFoundException if book not found', async () => {
      const id = '1';

      repository.exists.mockResolvedValue(false);

      try {
        await service.getBookById(id);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Book Not Found');
      }
    });
  });

  describe('updateBook', () => {
    it('should update a book successfully', async () => {
      const id = '1';
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        genre: 'Non-fiction',
        authorId: '1',
        availableCopies: 10,
        publishedYear: '2022',
      };

      repository.exists.mockResolvedValue(true);
      repository.findOneAndUpdate.mockResolvedValue({ id, ...updateBookDto });

      const result = await service.updateBook(id, updateBookDto);

      expect(result).toEqual({ id, ...updateBookDto });
      expect(repository.exists).toHaveBeenCalledWith({ id });
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { id },
        updateBookDto,
      );
    });

    it('should throw NotFoundException if book not found', async () => {
      const id = '1';
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        genre: 'Non-fiction',
        authorId: '1',
        availableCopies: 10,
        publishedYear: '2022',
      };

      repository.exists.mockResolvedValue(false);

      try {
        await service.updateBook(id, updateBookDto);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Book Not Found');
      }
    });
  });

  describe('deleteBook', () => {
    it('should delete a book successfully', async () => {
      const id = '1';

      repository.exists.mockResolvedValue(true);
      repository.findOneAndDelete.mockResolvedValue({ deleted: true });

      const result = await service.deleteBook(id);

      expect(result).toEqual({ deleted: true });
      expect(repository.exists).toHaveBeenCalledWith({ id });
      expect(repository.findOneAndDelete).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if book not found', async () => {
      const id = '1';

      repository.exists.mockResolvedValue(false);

      try {
        await service.deleteBook(id);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Book Not Found');
      }
    });
  });
});
