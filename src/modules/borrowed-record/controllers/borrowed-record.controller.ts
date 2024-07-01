import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginatedQuery, PaginatedQueryDoc } from '../../../libs/constants';
import { BorrowedRecordService } from '../services/borrowed-record.service';
import { AddBorrowedRecordDto } from '../dto/AddBorrowedRecord.dto';
import { UpdateBorrowedRecordDto } from '../dto/UpdateBorrowedRecord.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../libs/common/guards/auth.guard';

@ApiTags('Borrowed Records')
@Controller('borrow-records')
export class BorrowedRecordController {
  constructor(private readonly borrowedRecordService: BorrowedRecordService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Borrow Record' })
  @Post('/')
  async createAuthor(@Body() addBorrowedRecordDto: AddBorrowedRecordDto) {
    const res = await this.borrowedRecordService.createBorrowedRecord(
      addBorrowedRecordDto,
    );
    return res;
  }

  @ApiOperation({ summary: 'Get All Borrowed Records' })
  @ApiQuery({type: PaginatedQueryDoc})
  @Get('/')
  async getAllBorrowedRecords(@Query() data: PaginatedQuery) {
    const res = await this.borrowedRecordService.getAllPaginatedBorrowedRecords(
      data,
    );
    return res;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Borrowed Record By ID' })
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

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Borrowed Record' })
  @Delete('/:id')
  async deleteBorrowedRecord(@Param('id') id: string) {
    const res = await this.borrowedRecordService.deleteBorrowedRecord(id);
    return res;
  }
}
