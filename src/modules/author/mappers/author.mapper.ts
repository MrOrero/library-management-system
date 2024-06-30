import { AuthorDomain } from "../domain/author.domain";
import { Authors } from "../models/author.model";

export class AuthorMapper {
  public static toPersistence(author: AuthorDomain): Authors {
    return {
      id: author.id,
      name: author.name,
      birthdate: author.birthdate,
      bio: author.bio,
    };
  }
}
