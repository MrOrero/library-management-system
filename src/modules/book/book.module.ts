import { Logger, Module } from "@nestjs/common";
import { InjectionTokens } from "src/libs/constants";
import { BookRepository } from "./repository/book.repository";
import { Books } from "./models/book.model";
import { BookService } from "./services/book.service";
import { BookController } from "./controllers/book.controller";

const infrastructure = [
  {
    provide: InjectionTokens.BOOK_REPOSITORY,
    useFactory: () => {
      return new BookRepository(Books);
    },
  },
];

@Module({
  imports: [],
  controllers: [BookController],
  providers: [Logger, ...infrastructure, BookService],
})
export class BookModule {}
