import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'tasks',
})
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  task: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  complete: boolean;

  @Column({ length: 255 })
  userId: string;
}

export class TaskFillableFields {
  task: string;
}
