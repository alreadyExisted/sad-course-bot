import { Module } from '@nestjs/common'
import { BotModule } from 'src/bot'
import { ParserModule } from 'src/parser'
import { ChatsModule } from 'src/chats'
import { CourseModule } from 'src/course'
import { TasksService } from './tasks.service'

@Module({
  imports: [BotModule, ParserModule, CourseModule, ChatsModule],
  providers: [TasksService]
})
export class TasksModule {}
