import { BaseEntity } from 'src/libs/db/BaseEntity';
import { Authors } from 'src/modules/author/models/author.model';
import { BorrowedRecords } from 'src/modules/borrowed-record/borrowed-record.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Books extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;
  
  @Column()
  authorId: string;

  @ManyToOne(() => Authors, author => author.books)
  @JoinColumn({ name: 'authorId' })
  author: Authors;

  @Column()
  publishedYear: string

  @Column('text', { array: true })
  genre: string[];

  @Column()
  availableCopies: number

  @OneToMany(() => BorrowedRecords, borrowedRecord => borrowedRecord.book)
  borrowedRecords: BorrowedRecords[];
}
