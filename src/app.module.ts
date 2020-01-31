import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { BotModule } from './bot'
import { TasksModule } from './tasks'
import { CacheModule } from './cache'
import configModuleOptions from './config'
import { ParserModule } from './parser'

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    }),
    ScheduleModule.forRoot(),
    CacheModule,
    BotModule,
    ParserModule,
    TasksModule
  ],
  controllers: [AppController],
  providers: [ConfigService]
})
export class AppModule {}
