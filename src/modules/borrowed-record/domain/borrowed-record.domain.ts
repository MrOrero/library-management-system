import { BaseAggregateRoot } from 'src/libs/domain/BaseAggregateRoot';
import { UniqueEntityID } from 'src/libs/domain/UniqueEntityID';
import { Guard } from 'src/libs/domain/logic/Guard';
import { Result } from 'src/libs/domain/logic/Result';
import { AddBorrowedRecordDto } from '../dto/AddBorrowedRecord.dto';

interface BorrowedRecordProps {
  bookId: string;
  borrower: string;
  borrowDate: string;
  returnDate: string;
}

export class BorrowedRecordDomain extends BaseAggregateRoot<BorrowedRecordProps> {
  private constructor(props: BorrowedRecordProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): string {
    return this._id.toString();
  }

  get bookId(): string {
    return this.props.bookId;
  }

  get borrower(): string {
    return this.props.borrower;
  }

  get borrowDate(): Date {
    return new Date(this.props.borrowDate);
  }

  get returnDate(): Date {
    return new Date(this.props.returnDate);
  }

  public static create(
    props: BorrowedRecordProps,
    id?: UniqueEntityID,
  ): Result<BorrowedRecordDomain> {
    const guardResult = Guard.validate<
      AddBorrowedRecordDto,
      BorrowedRecordProps
    >(AddBorrowedRecordDto, props);

    if (guardResult) {
      return Result.fail<BorrowedRecordDomain>(guardResult.errMsg);
    }

    const borrowedRecordDomain = new BorrowedRecordDomain(
      {
        ...props,
      },
      id,
    );

    return Result.ok<BorrowedRecordDomain>(borrowedRecordDomain);
  }
}
