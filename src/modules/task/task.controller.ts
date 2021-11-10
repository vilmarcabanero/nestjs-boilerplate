import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'modules/common/decorator/current-user.decorator';
import { User } from 'modules/user';
import { TaskPayload, TasksService } from '.';

@Controller('api/tasks')
@ApiTags('authentication')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiResponse({ status: 200, description: 'Successful Response' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@CurrentUser() user: User): Promise<any> {
    return await this.tasksService.getTasks(user);
  }

  @Get('active') //Should appear before params.
  async getActiveTasks(@CurrentUser() user: User): Promise<any> {
    return await this.tasksService.getActiveTasks(user);
  }

  @Get('complete')
  async getCompleteTasks(@CurrentUser() user: User): Promise<any> {
    return await this.tasksService.getCompleteTasks(user);
  }

  @Get('/:id')
  async getTask(@Param('id') id: string): Promise<any> {
    return await this.tasksService.getTask(id);
  }

  @Post()
  async createTask(
    @Body() payload: TaskPayload,
    @CurrentUser() user: User,
  ): Promise<any> {
    return await this.tasksService.createTask(payload, user);
  }

  @Patch('complete/:id')
  async completeTask(@Param('id') id: string): Promise<any> {
    return await this.tasksService.completeTask(id);
  }

  @Patch('incomplete/:id')
  async incompleteTask(@Param('id') id: string): Promise<any> {
    return await this.tasksService.incompleteTask(id);
  }
  
  @Patch('archive')
  async archiveCompleteTasks(@CurrentUser() user: User): Promise<any> {
    return await this.tasksService.archiveCompleteTasks(user);
  }
  @Patch('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() payload: TaskPayload,
  ): Promise<any> {
    return await this.tasksService.updateTask(id, payload);
  }


  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<any> {
    return await this.tasksService.deleteTask(id);
  }
}
