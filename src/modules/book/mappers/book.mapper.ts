import { BookDomain } from "../domain/book.domain";
import { Books } from "../models/book.model";

export class BookMapper {
  public static toPersistence(author: BookDomain): Books {
    return {
      id: author.id,
        title: author.title,
        authorId: author.authorId,
        publishedYear: author.publishedYear,
        genre: author.genre,
        availableCopies: author.availableCopies,
    };
  }
}
