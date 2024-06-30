import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectionTokens, PaginatedQuery } from 'src/libs/constants';
import { handleErrorCatch } from 'src/libs/domain/utils/helper';
import { BorrowedRecordRepository } from '../repository/borrowed-record.repository';
import { AddBorrowedRecordDto } from '../dto/AddBorrowedRecord.dto';
import { BorrowedRecordDomain } from '../domain/borrowed-record.domain';
import { BorrowedRecordMapper } from '../mappers/BorrowedRecordMapper';
import { UpdateBorrowedRecordDto } from '../dto/UpdateBorrowedRecord.dto';

@Injectable()
export class BorrowedRecordService {
  @Inject(InjectionTokens.BORROWED_RECORD_REPOSITORY)
  private readonly borrowedRecordRepository: BorrowedRecordRepository;

  async createBorrowedRecord(dto: AddBorrowedRecordDto) {
    try {
      const borrowedRecordOrError = BorrowedRecordDomain.create(dto);

      if (borrowedRecordOrError.isFailure) {
        throw new BadRequestException(borrowedRecordOrError.errorValue());
      }

      const borrowedRecordDomain = borrowedRecordOrError.getValue();

      const book = BorrowedRecordMapper.toPersistence(borrowedRecordDomain);

      const res = await this.borrowedRecordRepository.save(book);
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
        throw new BadRequestException('Borrowed Record Not Found');
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
        throw new BadRequestException('Borrowed Record Not Found');
      }
      return this.borrowedRecordRepository.findOneAndDelete({ id });
    } catch (error) {
      handleErrorCatch(error, 'Delete Borrowed Record');
    }
  }
}
