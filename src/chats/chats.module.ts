import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CacheModule } from 'src/cache'
import { ChatsSchema } from './schemas'
import { ChatsService } from './services'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chats', schema: ChatsSchema }]),
    CacheModule
  ],
  providers: [ChatsService],
  exports: [ChatsService]
})
export class ChatsModule {}
