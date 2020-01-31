import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import TelegramBot, { ContextMessageUpdate } from 'telegraf'
import { ParserService } from 'src/parser'
import { ChatsService } from 'src/chats'

@Injectable()
export class BotService {
  private bot!: TelegramBot<ContextMessageUpdate>

  constructor(
    private configService: ConfigService,
    private parserService: ParserService,
    private chatsService: ChatsService
  ) {}

  initClient() {
    this.bot = new TelegramBot(
      this.configService.get<string>('TELEGRAM_TOKEN')!
    )
    this.registerCommands()
    this.bot.launch()
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
      await this.chatsService.createChat({
        id: ctx.chat!.id
      })
    })

    this.bot.on('sticker', ctx => {
      console.log('sticker', ctx.message)
    })
  }

  private async sendCourse(ctx: ContextMessageUpdate) {
    const {
      purchaseCourse,
      sellingCourse
    } = await this.parserService.parseCourse()
    await ctx.reply(
      `Курс доллара к гривне на межбанке:\n\nПокупка: *${purchaseCourse.text}*\nПродажа: *${sellingCourse.text}*`,
      {
        parse_mode: 'Markdown'
      }
    )
  }

  private async sendSadCourse(ctx: ContextMessageUpdate) {
    const { purchaseCourse } = await this.parserService.parseCourse()
    await ctx.reply(
      `SAD КУРС ДОЛЛАРА К ГРИВНЕ: *${this.getSadCourse(purchaseCourse.value)}*`,
      {
        parse_mode: 'Markdown'
      }
    )
  }

  private getSadCourse(course: number) {
    return round(course * 0.95, -1)
  }
}

const MESSAGES = {
  START:
    'Добро Пожаловать! Этот бот предоставляет функционал отслеживания и нотификации ' +
    'изменений курса доллара к гривне. Так же можно посмотреть Sad Course и понять ' +
    'что у вас не так уж все и плохо.',
  LISTEN: 'Вы подписались на нотификации изменения курса доллара к гривне.',
  UNLISTEN: 'Вы отписались от нотификаций изменения курса доллара к гривне.'
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
    'CAACAgIAAxkBAAMlXjQpXAx4UKeji_L0c0xBtgv6XMgAAqcFAAJTsfcDnPoEnyQmCa4YBA'
}

function round(value: number | string[], exp: number) {
  if (typeof exp === 'undefined' || exp === 0) {
    return Math.round(value as number)
  }

  value = +value
  exp = +exp

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN
  }

  value = value.toString().split('e')
  value = Math.round(+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)))

  value = value.toString().split('e')
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp))
}
