import { Module, HttpModule, OnModuleInit } from '@nestjs/common'
import { ParserService } from './parser.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ParserService],
  exports: [ParserService]
})
export class ParserModule implements OnModuleInit {
  constructor(private parserService: ParserService) {}

  onModuleInit() {
    this.parserService.parseCourse()
  }
}
