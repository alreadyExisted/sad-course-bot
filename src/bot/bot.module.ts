import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ChatsModule } from 'src/chats'
import { ParserModule } from 'src/parser'
import { BotService } from './bot.service'

@Module({
  imports: [ConfigModule, ParserModule, ChatsModule],
  providers: [BotService],
  exports: [BotService]
})
export class BotModule implements OnModuleInit {
  constructor(private botService: BotService) {}

  onModuleInit() {
    this.botService.initClient()
  }
}
