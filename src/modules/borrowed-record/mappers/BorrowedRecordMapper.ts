import { BorrowedRecordDomain } from "../domain/borrowed-record.domain";
import { BorrowedRecords } from "../models/borrowed-record.model";

export class BorrowedRecordMapper {
  public static toPersistence(borrowedRecord: BorrowedRecordDomain): BorrowedRecords {
    return {
      id: borrowedRecord.id,
      bookId: borrowedRecord.bookId,
      borrowDate: borrowedRecord.borrowDate,
      borrower: borrowedRecord.borrower,
      returnDate: borrowedRecord.returnDate
    };
  }
}
