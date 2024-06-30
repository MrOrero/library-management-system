import { BaseAggregateRoot } from 'src/libs/domain/BaseAggregateRoot';
import { UniqueEntityID } from 'src/libs/domain/UniqueEntityID';
import { Guard } from 'src/libs/domain/logic/Guard';
import { Result } from 'src/libs/domain/logic/Result';
import { AddBookDto } from '../dto/AddBook.dto';

interface BookProps {
  title: string;
  authorId: string;
  publishedYear: string;
  genre: string;
  availableCopies: number;
}

export class BookDomain extends BaseAggregateRoot<BookProps> {
  private constructor(props: BookProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): string {
    return this._id.toString();
  }

  get title(): string {
    return this.props.title;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get publishedYear(): string {
    return this.props.publishedYear;
  }

  get genre(): string {
    return this.props.genre;
  }

  get availableCopies(): number {
    return this.props.availableCopies;
  }

  public static create(
    props: BookProps,
    id?: UniqueEntityID,
  ): Result<BookDomain> {
    const guardResult = Guard.validate<AddBookDto, BookProps>(
      AddBookDto,
      props,
    );

    if (guardResult) {
      return Result.fail<BookDomain>(guardResult.errMsg);
    }

    const bookDomain = new BookDomain(
      {
        ...props,
      },
      id,
    );

    return Result.ok<BookDomain>(bookDomain);
  }
}
