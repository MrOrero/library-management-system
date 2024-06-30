import { BaseEntity } from 'src/libs/db/BaseEntity';
import { Author } from 'src/modules/author/models/author.model';
import { BorrowedRecord } from 'src/modules/borrowed-record/borrowed-record.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Book extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;
  
  @Column()
  authorId: string;

  @ManyToOne(() => Author, author => author.books)
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @Column()
  publishedYear: string

  @Column('text', { array: true })
  genre: string[];

  @Column()
  availableCopies: number

  @OneToMany(() => BorrowedRecord, borrowedRecord => borrowedRecord.book)
  borrowedRecords: BorrowedRecord[];
}
