import { BookDomain } from "../domain/book.domain";
import { Books } from "../models/book.model";

export class BookMapper {
  public static toPersistence(book: BookDomain): Books {
    return {
        id: book.id,
        title: book.title,
        authorId: book.authorId,
        publishedYear: book.publishedYear,
        genre: book.genre,
        availableCopies: book.availableCopies,
    };
  }
}
