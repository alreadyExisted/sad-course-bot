import { Injectable, HttpService } from '@nestjs/common'
import cheerio from 'cheerio'
import { ConfigService } from '@nestjs/config'
import { Courses } from 'src/course'

@Injectable()
export class ParserService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async parseCourse(): Promise<Omit<Courses, 'status'>> {
    const url = this.configService.get<string>('PARSING_SITE_URL')!
    const { data } = await this.httpService.get<string>(url).toPromise()

    const $ = cheerio.load(data)

    const purchaseNode = $(
      '.mb-table-currency tr:nth-child(1) td[data-title="Доллар"]'
    ).text()
    const [purchaseText] = purchaseNode.split('\n')

    const sellingNode = $(
      '.mb-table-currency tr:nth-child(2) td[data-title="Доллар"]'
    ).text()
    const [sellingText] = sellingNode.split('\n')

    return {
      purchase: {
        text: purchaseText,
        value: parseFloat(purchaseText)
      },
      selling: {
        text: sellingText,
        value: parseFloat(sellingText)
      }
    }
  }
}
