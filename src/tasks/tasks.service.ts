import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { BotService } from 'src/bot'
import { ParserService } from 'src/parser'

@Injectable()
export class TasksService {
  private logger: Logger

  constructor(
    private botService: BotService,
    private parserService: ParserService
  ) {
    this.logger = new Logger(TasksService.name)
  }

  @Cron('0 * 10-17 * 1-5')
  checkCourseChanges() {
    this.parserService.parseCourse().then(result => {
      this.logger.debug('Check course changes')
    })
  }
}
