import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './libs/db/DatabaseModule';
import { AuthorModule } from './modules/author/author.module';
import { BookModule } from './modules/book/book.module';
import { BorrowedRecordModule } from './modules/borrowed-record/borrowed-record.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthorModule,
    BookModule,
    BorrowedRecordModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
