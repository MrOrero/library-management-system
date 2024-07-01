import { Logger, Module } from "@nestjs/common";
import { InjectionTokens } from "../../libs/constants";
import { AuthorRepository } from "./repository/author.repository";
import { Authors } from "./models/author.model";
import { AuthorService } from "./services/author.service";
import { AuthorController } from "./controllers/author.controller";

const infrastructure = [
  {
    provide: InjectionTokens.AUTHOR_REPOSITORY,
    useFactory: () => {
      return new AuthorRepository(Authors);
    },
  },
];

@Module({
  imports: [],
  controllers: [AuthorController],
  providers: [Logger, ...infrastructure, AuthorService],
})
export class AuthorModule {}
