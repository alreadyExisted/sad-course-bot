import { Module, HttpModule } from '@nestjs/common'
import { ParserService } from './parser.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ParserService],
  exports: [ParserService]
})
export class ParserModule {}
