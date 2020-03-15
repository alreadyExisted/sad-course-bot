import { Module, HttpModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BotModule } from 'src/bot'
import { ParserModule } from 'src/parser'
import { ChatsModule } from 'src/chats'
import { TasksService } from './tasks.service'

@Module({
  imports: [BotModule, ParserModule, ChatsModule, HttpModule, ConfigModule],
  providers: [TasksService]
})
export class TasksModule { }
