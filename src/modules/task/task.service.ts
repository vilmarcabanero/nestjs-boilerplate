import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'modules/user';
import { Repository } from 'typeorm';
import { TaskPayload } from '.';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async getTasks(user: User) {
    const filter = {
      where: {
        userId: user.id,
      },
    };
    return this.taskRepo.find(filter);
  }

  async getTask(id: string) {
    const task = await this.taskRepo.findOne({ id });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async getActiveTasks(user: User) {
    const filter = {
      where: {
        isActive: true,
        userId: user.id,
      },
    };
    return this.taskRepo.find(filter);
  }

  async getCompleteTasks(user: User) {
    const filter = {
      where: {
        complete: true,
        userId: user.id,
      },
    };
    return this.taskRepo.find(filter);
  }

  async createTask(payload: TaskPayload, user: User) {
    const { task } = payload;
    const userId = user.id;

    const found = this.taskRepo.create({
      task,
      userId: userId,
    });

    return await this.taskRepo.save(found);
  }

  async completeTask(id: string) {
    const found = await this.getTask(id);
    found.complete = true;

    return this.taskRepo.save(found);
  }

  async incompleteTask(id: string) {
    const task = await this.getTask(id);
    task.complete = false;

    return this.taskRepo.save(task);
  }

  async updateTask(id: string, payload: TaskPayload) {
    const found = await this.getTask(id);
    found.task = payload.task;

    return this.taskRepo.save(found);
  }

  async archiveCompleteTasks(user: User) {
    const foundTasks = await this.getCompleteTasks(user);
    foundTasks.map((task) => {
      task.isActive = false;
    });

    return this.taskRepo.save(foundTasks);
  }

  async deleteTask(id: string): Promise<any> {
    const result = await this.taskRepo.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return {
      status: 'ok',
      message: `Task with ID ${id} was deleted successfully.`,
    };
  }
}
