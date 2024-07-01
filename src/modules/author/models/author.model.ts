import { BaseEntity } from '../../../libs/db/BaseEntity';
import { Books } from '../../../modules/book/models/book.model';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Authors extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  birthdate: Date;

  @Column()
  bio: string;

  @OneToMany(() => Books, book => book.author)
  books?: Books[];
}
