import { Module } from '@nestjs/common'
import { BotModule } from 'src/bot'
import { ParserModule } from 'src/parser'
import { TasksService } from './tasks.service'

@Module({
  imports: [BotModule, ParserModule],
  providers: [TasksService]
})
export class TasksModule {}
