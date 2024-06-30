import { BaseEntity } from 'src/libs/db/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Books } from '../book/models/book.model';

@Entity()
export class BorrowedRecords extends BaseEntity {
  @PrimaryColumn()
  id: string;
  
  @Column()
  bookId: string;

  @ManyToOne(() => Books, book => book.borrowedRecords)
  @JoinColumn({ name: 'bookId' })
  book: Books;
 
  @Column()
  borrower: string

  @Column()
  borrowDate: Date

  @Column()
  returnDate: Date
}
