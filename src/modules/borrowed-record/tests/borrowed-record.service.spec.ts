import { Test, TestingModule } from '@nestjs/testing';
import { AddBorrowedRecordDto } from '../dto/AddBorrowedRecord.dto';
import { UpdateBorrowedRecordDto } from '../dto/UpdateBorrowedRecord.dto';
import {
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { BorrowedRecordDomain } from '../domain/borrowed-record.domain';
import { BorrowedRecordMapper } from '../mappers/BorrowedRecordMapper';
import { BorrowedRecordService } from '../services/borrowed-record.service';
import { InjectionTokens } from '../../../libs/constants';
import { BookService } from '../../../modules/book/services/book.service';

class MockBorrowedRecordRepository {
  save = jest.fn();
  findPaginated = jest.fn();
  exists = jest.fn();
  findOne = jest.fn();
  findOneAndUpdate = jest.fn();
  findOneAndDelete = jest.fn();
}

class MockBookService {
  getBookById = jest.fn();
  updateBook = jest.fn();
}

describe('BorrowedRecordService', () => {
  let service: BorrowedRecordService;
  let repository: MockBorrowedRecordRepository;
  let bookService: MockBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowedRecordService,
        {
          provide: InjectionTokens.BORROWED_RECORD_REPOSITORY,
          useClass: MockBorrowedRecordRepository,
        },
        {
          provide: BookService,
          useClass: MockBookService,
        },
      ],
    }).compile();

    service = module.get<BorrowedRecordService>(BorrowedRecordService);
    repository = module.get<MockBorrowedRecordRepository>(
      InjectionTokens.BORROWED_RECORD_REPOSITORY,
    );
    bookService = module.get<MockBookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBorrowedRecord', () => {
    it('should create a borrowed record successfully', async () => {
      const addBorrowedRecordDto: AddBorrowedRecordDto = {
        bookId: '00000000-0000-0000-0000-000000000000',
        borrowDate: '2023-01-01',
        returnDate: '2023-01-15',
        borrower: 'user1',
      };

      const book = {
        id: '1',
        availableCopies: 5,
      };

      const borrowedRecordDomain =
        BorrowedRecordDomain.create(addBorrowedRecordDto).getValue();
      const borrowedRecord =
        BorrowedRecordMapper.toPersistence(borrowedRecordDomain);

      bookService.getBookById.mockResolvedValue(book);
      repository.save.mockResolvedValue(borrowedRecord);
      bookService.updateBook.mockResolvedValue(undefined);

      const result = await service.createBorrowedRecord(addBorrowedRecordDto);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('bookId', borrowedRecord.bookId);
      expect(result).toHaveProperty('borrowDate', borrowedRecord.borrowDate);
      expect(result).toHaveProperty('returnDate', borrowedRecord.returnDate);
      expect(result).toHaveProperty('borrower', borrowedRecord.borrower);
      expect(repository.save).toHaveBeenCalled();
      expect(bookService.updateBook).toHaveBeenCalled();
    });

    it('should throw BadRequestException if book not found', async () => {
      const addBorrowedRecordDto: AddBorrowedRecordDto = {
        bookId: '1',
        borrowDate: '2023-01-01',
        returnDate: '2023-01-15',
        borrower: 'user1',
      };

      bookService.getBookById.mockResolvedValue(null);

      try {
        await service.createBorrowedRecord(addBorrowedRecordDto);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Book Not Found');
      }
    });

    it('should throw BadRequestException if book out of stock', async () => {
      const addBorrowedRecordDto: AddBorrowedRecordDto = {
        bookId: '1',
        borrowDate: '2023-01-01',
        returnDate: '2023-01-15',
        borrower: 'user1',
      };

      const book = {
        id: '1',
        availableCopies: 0,
      };

      bookService.getBookById.mockResolvedValue(book);

      try {
        await service.createBorrowedRecord(addBorrowedRecordDto);
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Book Out of Stock');
      }
    });
  });

  describe('getAllPaginatedBorrowedRecords', () => {
    it('should return paginated borrowed records', async () => {
      const paginatedQuery = { page: 1, limit: 10 };
      const paginatedResult = { items: [], total: 0 };

      repository.findPaginated.mockResolvedValue(paginatedResult);

      const result = await service.getAllPaginatedBorrowedRecords(
        paginatedQuery,
      );

      expect(result).toEqual(paginatedResult);
      expect(repository.findPaginated).toHaveBeenCalledWith(paginatedQuery);
    });
  });

  describe('updateBorrowedRecord', () => {
    it('should update a borrowed record successfully', async () => {
      const id = '1';
      const updateBorrowedRecordDto: Partial<UpdateBorrowedRecordDto> = {
        returnDate: '2023-02-01',
      };

      repository.exists.mockResolvedValue(true);
      repository.findOneAndUpdate.mockResolvedValue({
        id,
        ...updateBorrowedRecordDto,
      });

      const result = await service.updateBorrowedRecord(
        id,
        updateBorrowedRecordDto as UpdateBorrowedRecordDto,
      );

      expect(result).toEqual({ id, ...updateBorrowedRecordDto });
      expect(repository.exists).toHaveBeenCalledWith({ id });
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { id },
        updateBorrowedRecordDto,
      );
    });

    it('should throw NotFoundException if borrowed record not found', async () => {
      const id = '1';
      const updateBorrowedRecordDto: Partial<UpdateBorrowedRecordDto> = {
        returnDate: '2023-02-01',
      };

      repository.exists.mockResolvedValue(false);

      try {
        await service.updateBorrowedRecord(
          id,
          updateBorrowedRecordDto as UpdateBorrowedRecordDto,
        );
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Borrowed Record Not Found');
      }
    });
  });

  describe('deleteBorrowedRecord', () => {
    it('should delete a borrowed record successfully', async () => {
      const id = '1';

      repository.exists.mockResolvedValue(true);
      repository.findOneAndDelete.mockResolvedValue({ deleted: true });

      const result = await service.deleteBorrowedRecord(id);

      expect(result).toEqual({ deleted: true });
      expect(repository.exists).toHaveBeenCalledWith({ id });
      expect(repository.findOneAndDelete).toHaveBeenCalledWith({ id });
    });

    it('should throw NotFoundException if borrowed record not found', async () => {
      const id = '1';

      repository.exists.mockResolvedValue(false);

      try {
        await service.deleteBorrowedRecord(id);
      } catch (error) {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Borrowed Record Not Found');
      }
    });
  });
});
