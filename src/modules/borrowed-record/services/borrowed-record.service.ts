import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectionTokens, PaginatedQuery } from '../../../libs/constants';
import { handleErrorCatch } from '../../../libs/common/utils/helper';
import { BorrowedRecordRepository } from '../repository/borrowed-record.repository';
import { AddBorrowedRecordDto } from '../dto/AddBorrowedRecord.dto';
import { BorrowedRecordDomain } from '../domain/borrowed-record.domain';
import { BorrowedRecordMapper } from '../mappers/BorrowedRecordMapper';
import { UpdateBorrowedRecordDto } from '../dto/UpdateBorrowedRecord.dto';
import { BookService } from '../../../modules/book/services/book.service';
import { UpdateBookDto } from '../../../modules/book/dto/UpdateBook.dto';

@Injectable()
export class BorrowedRecordService {
  @Inject(InjectionTokens.BORROWED_RECORD_REPOSITORY)
  private readonly borrowedRecordRepository: BorrowedRecordRepository;
  @Inject() private readonly bookService: BookService;

  async createBorrowedRecord(dto: AddBorrowedRecordDto) {
    try {
      const book = await this.bookService.getBookById(dto.bookId);

      if (!book) {
        throw new BadRequestException('Book Not Found');
      }

      if (book.availableCopies <= 0) {
        throw new BadRequestException('Book Out of Stock');
      }

      const borrowedRecordOrError = BorrowedRecordDomain.create(dto);

      if (borrowedRecordOrError.isFailure) {
        throw new BadRequestException(borrowedRecordOrError.errorValue());
      }

      const borrowedRecordDomain = borrowedRecordOrError.getValue();

      const borrowedRecord =
        BorrowedRecordMapper.toPersistence(borrowedRecordDomain);

      const res = await this.borrowedRecordRepository.save(borrowedRecord);

      await this.bookService.updateBook(dto.bookId, {
        availableCopies: book.availableCopies - 1,
      } as UpdateBookDto);

      return res;
    } catch (error) {
      handleErrorCatch(error, 'Create Borrowed Record');
    }
  }

  async getAllPaginatedBorrowedRecords(data: PaginatedQuery) {
    try {
      return await this.borrowedRecordRepository.findPaginated(data);
    } catch (error) {
      handleErrorCatch(error, 'Get All Paginated Borrowed Records');
    }
  }

  async updateBorrowedRecord(id: string, dto: UpdateBorrowedRecordDto) {
    try {
      const borrowedRecordExists = await this.borrowedRecordRepository.exists({
        id,
      });

      if (!borrowedRecordExists) {
        throw new NotFoundException('Borrowed Record Not Found');
      }

      return this.borrowedRecordRepository.findOneAndUpdate(
        { id },
        {
          ...dto,
        },
      );
    } catch (error) {
      handleErrorCatch(error, 'Update Borrowed Record');
    }
  }

  async deleteBorrowedRecord(id: string) {
    try {
      const borrowedRecordExists = await this.borrowedRecordRepository.exists({
        id,
      });

      if (!borrowedRecordExists) {
        throw new NotFoundException('Borrowed Record Not Found');
      }
      return this.borrowedRecordRepository.findOneAndDelete({ id });
    } catch (error) {
      handleErrorCatch(error, 'Delete Borrowed Record');
    }
  }
}
