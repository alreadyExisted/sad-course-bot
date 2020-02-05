import { Injectable, HttpService } from '@nestjs/common'
import cheerio from 'cheerio'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ParserService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async parseCourse() {
    const url = this.configService.get<string>('PARSING_SITE_URL')!
    const { data } = await this.httpService.get<string>(url).toPromise()

    const $ = cheerio.load(data)

    const purchaseNode = $(
      '.mb-table-currency tr:nth-child(1) td[data-title="Доллар"]'
    ).text()
    const [purchaseText, purchaseDeltaText] = purchaseNode.split('\n')

    const sellingNode = $(
      '.mb-table-currency tr:nth-child(2) td[data-title="Доллар"]'
    ).text()
    const [sellingText, sellingDeltaText] = sellingNode.split('\n')

    return {
      purchase: {
        value: purchaseText,
        delta: purchaseDeltaText,
        deltaValue: parseFloat(purchaseDeltaText)
      },
      selling: {
        value: sellingText,
        delta: sellingDeltaText,
        deltaValue: parseFloat(sellingDeltaText)
      }
    }
  }
}

interface Course {
  value: string
  delta: string
  deltaValue: number
}

export interface Courses {
  purchase: Course
  selling: Course
}
