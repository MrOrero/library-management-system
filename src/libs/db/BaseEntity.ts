import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @Exclude()
  @CreateDateColumn()
  createdAt?: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt?: Date;

  @Exclude()
  @VersionColumn({ default: 0 })
  version?: number;
}
