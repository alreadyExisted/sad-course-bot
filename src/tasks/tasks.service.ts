import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { BotService } from 'src/bot'
import { ParserService } from 'src/parser'
import { ChatsService } from 'src/chats'

@Injectable()
export class TasksService {
  private logger: Logger

  constructor(
    private botService: BotService,
    private parserService: ParserService,
    private chatsService: ChatsService
  ) {
    this.logger = new Logger(TasksService.name)
  }

  @Cron('30 0 10-17 * * 1-5')
  async checkCourseChanges() {
    const courses = await this.parserService.parseCourse()
    const chats = await this.chatsService.getChats()

    if (courses.purchase.deltaValue === 0 && courses.selling.deltaValue === 0) {
      this.logger.debug('Course not changed')
      return
    }

    chats.forEach(({ id }) => {
      this.botService.sendNotification(id, courses).then(() => {
        this.logger.debug(`Sended notification about courses to chat: ${id}`)
      })
    })
  }
}
