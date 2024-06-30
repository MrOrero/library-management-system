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
import { PaginatedQuery } from 'src/libs/constants';
import { BorrowedRecordService } from '../services/borrowed-record.service';
import { AddBorrowedRecordDto } from '../dto/AddBorrowedRecord.dto';
import { UpdateBorrowedRecordDto } from '../dto/UpdateBorrowedRecord.dto';

@Controller('borrow-records')
export class BorrowedRecordController {
  constructor(private readonly borrowedRecordService: BorrowedRecordService) {}

  @Post('/')
  async createAuthor(@Body() addBorrowedRecordDto: AddBorrowedRecordDto) {
    const res = await this.borrowedRecordService.createBorrowedRecord(
      addBorrowedRecordDto,
    );
    return res;
  }

  @Get('/')
  async getAllBorrowedRecords(@Query() data: PaginatedQuery) {
    const res = await this.borrowedRecordService.getAllPaginatedBorrowedRecords(
      data,
    );
    return res;
  }

  @Put('/:id')
  async updateBorrowedRecord(
    @Param('id') id: string,
    @Body() addBorrowedRecordDto: UpdateBorrowedRecordDto,
  ) {
    const res = await this.borrowedRecordService.updateBorrowedRecord(
      id,
      addBorrowedRecordDto,
    );
    return res;
  }

  @Delete('/:id')
  async deleteBorrowedRecord(@Param('id') id: string) {
    const res = await this.borrowedRecordService.deleteBorrowedRecord(id);
    return res;
  }
}
