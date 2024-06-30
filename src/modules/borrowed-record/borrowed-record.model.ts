import { BaseEntity } from 'src/libs/db/BaseEntity';
import { Author } from 'src/modules/author/models/author.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Book } from '../book/models/book.model';

@Entity()
export class BorrowedRecord extends BaseEntity {
  @PrimaryColumn()
  id: string;
  
  @Column()
  bookId: string;

  @ManyToOne(() => Book, book => book.borrowedRecords)
  @JoinColumn({ name: 'bookId' })
  book: Book;
 
  @Column()
  borrower: string

  @Column()
  borrowDate: Date

  @Column()
  returnDate: Date
}
