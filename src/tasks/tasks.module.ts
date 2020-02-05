import { Module } from '@nestjs/common'
import { BotModule } from 'src/bot'
import { ParserModule } from 'src/parser'
import { ChatsModule } from 'src/chats'
import { TasksService } from './tasks.service'

@Module({
  imports: [BotModule, ParserModule, ChatsModule],
  providers: [TasksService]
})
export class TasksModule {}
