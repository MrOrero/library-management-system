import { BaseEntity } from 'src/libs/db/BaseEntity';
import { Book } from 'src/modules/book/models/book.model';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Author extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  birthdate: Date;

  @Column()
  bio: string;

  @OneToMany(() => Book, book => book.author)
  books: Book[];
}
