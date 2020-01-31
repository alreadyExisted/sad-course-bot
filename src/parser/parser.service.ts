import { Injectable, HttpService } from '@nestjs/common'
import cheerio from 'cheerio'
import { ConfigService } from '@nestjs/config'
import { Course, CourseStatus } from './parser.interface'

const DEFAULT_COURSE: Course = { value: 0, text: '0' }

@Injectable()
export class ParserService {
  private purchaseCourse: Course = DEFAULT_COURSE
  private sellingCourse: Course = DEFAULT_COURSE

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
    const [purchaseText] = purchaseNode.split('\n')
    const purchaseValue = parseFloat(purchaseText)
    const status = this.getStatus(purchaseValue)
    this.purchaseCourse = {
      value: purchaseValue,
      text: purchaseText
    }

    const sellingNode = $(
      '.mb-table-currency tr:nth-child(2) td[data-title="Доллар"]'
    ).text()
    const [sellingText] = sellingNode.split('\n')
    this.sellingCourse = {
      value: parseFloat(sellingText),
      text: sellingText
    }

    return {
      status,
      purchaseCourse: this.purchaseCourse,
      sellingCourse: this.sellingCourse
    }
  }

  private getStatus(courseValue: number) {
    switch (true) {
      case courseValue > this.purchaseCourse.value:
        return CourseStatus.Up
      case courseValue < this.purchaseCourse.value:
        return CourseStatus.Down
      default:
        return CourseStatus.None
    }
  }
}
