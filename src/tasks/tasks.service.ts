import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { BotService } from 'src/bot'
import { ParserService } from 'src/parser'
import { CourseService } from 'src/course'
import { ChatsService } from 'src/chats'

@Injectable()
export class TasksService {
  private logger: Logger

  constructor(
    private botService: BotService,
    private parserService: ParserService,
    private chatsService: ChatsService,
    private courseService: CourseService
  ) {
    this.logger = new Logger(TasksService.name)
  }

  @Cron('0 0 10-17 * * 1-5')
  async checkCourseChanges() {
    const courses = await this.parserService.parseCourse()
    const storedCourses = await this.courseService.setCourses(courses)
    const chats = await this.chatsService.getChats()
    chats.forEach(({ id }) => {
      this.botService
        .sendNotification(id, storedCourses)
        .then(isNotificated => {
          this.logger.debug(
            isNotificated
              ? `Sended notification about courses to chat: ${id}`
              : 'Course not changed'
          )
        })
    })
  }
}
