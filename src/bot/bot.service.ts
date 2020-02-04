import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import TelegramBot, { ContextMessageUpdate } from 'telegraf'
import { ChatsService } from 'src/chats'
import { CourseService, Courses, CourseStatus } from 'src/course'

const SAD_COURSE_RATIO = 0.07
const SAD_COURSE_DELTA = 0.5

@Injectable()
export class BotService {
  private logger: Logger
  private bot!: TelegramBot<ContextMessageUpdate>

  constructor(
    private configService: ConfigService,
    private courseService: CourseService,
    private chatsService: ChatsService
  ) {
    this.logger = new Logger(BotService.name)
  }

  initClient() {
    this.bot = new TelegramBot(
      this.configService.get<string>('TELEGRAM_TOKEN')!
    )
    this.registerCommands()
    this.bot.launch().then(() => this.logger.debug('Init bot client'))
  }

  async sendNotification(chatId: number, courses: Courses) {
    if (courses.status === CourseStatus.None) {
      return false
    }

    let stickerId: string
    let msg: string

    switch (courses.status) {
      case CourseStatus.Up:
        stickerId = STIKERS.COURSE_UP
        msg = MESSAGES.COURSE_UP
      case CourseStatus.Down:
        stickerId = STIKERS.COURSE_DOWN
        msg = MESSAGES.COURSE_DOWN
    }

    await this.bot.telegram.sendSticker(chatId, stickerId)
    await this.bot.telegram.sendMessage(
      chatId,
      `${msg}\n${this.getCourseMessage(courses)}`
    )

    return true
  }

  private async registerCommands() {
    this.bot.command('start', async ctx => {
      await ctx.replyWithSticker(STIKERS.START)
      await ctx.reply(MESSAGES.START)
    })

    this.bot.command('course', async ctx => {
      await ctx.replyWithSticker(STIKERS.COURSE)
      await this.sendCourse(ctx)
    })

    this.bot.command('sadcourse', async ctx => {
      await ctx.replyWithSticker(STIKERS.SADCOURSE)
      await this.sendSadCourse(ctx)
    })

    this.bot.command('listen', async ctx => {
      await ctx.replyWithSticker(STIKERS.LISTEN)
      await ctx.reply(MESSAGES.LISTEN)
      await this.chatsService.createChat({
        id: ctx.chat!.id
      })
    })

    this.bot.command('unlisten', async ctx => {
      await ctx.replyWithSticker(STIKERS.UNLISTEN)
      await ctx.reply(MESSAGES.UNLISTEN)
      await this.chatsService.deleteChat(ctx.chat!.id)
    })
  }

  private async sendCourse(ctx: ContextMessageUpdate) {
    const courses = await this.courseService.getCourses()
    await ctx.reply(this.getCourseMessage(courses), {
      parse_mode: 'Markdown'
    })
  }

  private async sendSadCourse(ctx: ContextMessageUpdate) {
    const { purchase } = await this.courseService.getCourses()
    await ctx.reply(
      `SAD КУРС ДОЛЛАРА К ГРИВНЕ: *${this.getSadCourse(purchase.value)}*`,
      {
        parse_mode: 'Markdown'
      }
    )
  }

  private getCourseMessage(courses: Courses) {
    return `Курс доллара к гривне на межбанке:\nПокупка: *${courses.purchase.text}*\nПродажа: *${courses.selling.text}*`
  }

  private getSadCourse(course: number) {
    const sadCourse = course - course * SAD_COURSE_RATIO
    const truncedSadCourse = Math.trunc(sadCourse)
    const sadCourseWithDelta = truncedSadCourse + SAD_COURSE_DELTA
    return sadCourseWithDelta > sadCourse
      ? truncedSadCourse
      : sadCourseWithDelta
  }
}

const MESSAGES = {
  START:
    'Добро Пожаловать! Этот бот предоставляет функционал отслеживания и нотификации ' +
    'изменений курса доллара к гривне на межбанке. Так же можно посмотреть Sad Course и понять ' +
    'что у вас не так уж все и плохо.',
  LISTEN:
    'Вы подписались на нотификации изменения курса доллара к гривне. Если курс будет меняться, то Вам прийдет оповещение.',
  UNLISTEN: 'Вы отписались от нотификаций изменения курса доллара к гривне.',
  COURSE_UP: 'Поздравляю!',
  COURSE_DOWN: 'Cожалею о вашей утрате.'
}

const STIKERS = {
  START:
    'CAACAgIAAxkBAAMPXjQkZwtfufILNHxjWh0Gq3tOh8AAAoEIAAJTsfcDxys73ldLHLkYBA',
  COURSE:
    'CAACAgIAAxkBAAM8XjQqgMZaQNFiR5A3nuXSYc3_wWoAAqA9AAJTsfcDayW6zAONNJUYBA',
  SADCOURSE:
    'CAACAgIAAxkBAAO2XjRUyMWizmTs11xq-OBJ8ZZZuQgAApsFAAJTsfcDQr8PvnocpXcYBA',
  LISTEN:
    'CAACAgIAAxkBAAMmXjQplWkO5v1X8nUM2is4hcUVAaUAAvsJAAJTsfcD8uP620C8f0UYBA',
  UNLISTEN:
    'CAACAgIAAxkBAAMlXjQpXAx4UKeji_L0c0xBtgv6XMgAAqcFAAJTsfcDnPoEnyQmCa4YBA',
  COURSE_UP:
    'CAACAgIAAxkBAAIBA145ZI75baV2doze_nnpkD8ivHyyAAKjBQACU7H3Axx0w7NtgkXrGAQ',
  COURSE_DOWN:
    'CAACAgIAAxkBAAIBBF45ZQm0l9fGJn05oNj1lzbohonqAAKpBQACU7H3AyGoLW0uy3YnGAQ'
}
