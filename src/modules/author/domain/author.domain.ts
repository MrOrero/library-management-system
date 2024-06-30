import { BaseAggregateRoot } from "src/libs/domain/BaseAggregateRoot";
import { UniqueEntityID } from "src/libs/domain/UniqueEntityID";
import { Guard } from "src/libs/domain/logic/Guard";
import { Result } from "src/libs/domain/logic/Result";
import { CreateAuthorDto } from "../dto/CreateAuthor.dto";

interface AuthorProps {
  name: string;
  birthdate: string;
  bio: string;
}

export class AuthorDomain extends BaseAggregateRoot<AuthorProps> {
  private constructor(props: AuthorProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): string {
    return this._id.toString();
  }

  get name(): string {
    return this.props.name;
  }

  get birthdate(): Date {
    return new Date(this.props.birthdate);
  }

  get bio(): string {
    return this.props.bio;
  }

  public static create(props: AuthorProps, id?: UniqueEntityID): Result<AuthorDomain> {
    const guardResult = Guard.validate<CreateAuthorDto, AuthorProps>(CreateAuthorDto, props);

    if (guardResult) {
      return Result.fail<AuthorDomain>(guardResult.errMsg);
    }

    const authorDomain = new AuthorDomain(
      {
        ...props,
      },
      id
    );

    return Result.ok<AuthorDomain>(authorDomain);
  }
}
