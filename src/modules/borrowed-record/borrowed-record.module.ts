import { Logger, Module } from "@nestjs/common";
import { InjectionTokens } from "src/libs/constants";
import { BorrowedRecordRepository } from "./repository/borrowed-record.repository";
import { BorrowedRecords } from "./models/borrowed-record.model";
import { BorrowedRecordService } from "./services/borrowed-record.service";
import { BorrowedRecordController } from "./controllers/borrowed-record.controller";

const infrastructure = [
  {
    provide: InjectionTokens.BORROWED_RECORD_REPOSITORY,
    useFactory: () => {
      return new BorrowedRecordRepository(BorrowedRecords);
    },
  },
];

@Module({
  imports: [],
  controllers: [BorrowedRecordController],
  providers: [Logger, ...infrastructure, BorrowedRecordService],
})
export class BorrowedRecordModule {}
