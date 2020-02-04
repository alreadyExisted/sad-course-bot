import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CacheService } from 'src/cache'
import { Chat } from '../interfaces'
import { CreateChatDTO } from '../dtos'

const CHATS_CACHE_TTL = 60 * 60 * 24 // day

@Injectable()
export class ChatsService {
  private logger: Logger

  constructor(
    @InjectModel('Chats')
    private chatsModel: Model<Chat>,
    private cacheService: CacheService<CreateChatDTO[] | undefined>
  ) {
    this.logger = new Logger(ChatsService.name)
  }

  async createChat(input: CreateChatDTO) {
    const { chats, chat } = await this.getChatsData(input.id)

    if (!chat) {
      await this.cacheService.set('chats', [...(chats || []), input], {
        ttl: CHATS_CACHE_TTL
      })
      const chatModel = new this.chatsModel(input)
      await chatModel.save()
      this.logger.debug(`[Create] Added chat ${input.id} to db and cache`)
      return chatModel
    }

    this.logger.debug(`[Create] Chat ${input.id} already existed`)
    return chat
  }

  async deleteChat(id: number) {
    await this.chatsModel.deleteOne({ id }).exec()
    this.logger.debug(`[Delete] Chat ${id} deleted`)
    return true
  }

  async getChat(id: number) {
    const { chat } = await this.getChatsData(id)

    if (chat) {
      this.logger.debug(`[Read] Get chat ${chat.id} from cache`)
      return chat
    }

    this.logger.debug('[Read] Get chat from db')
    return this.chatsModel.findOne({ id }).exec()
  }

  async getChats() {
    const { chats } = await this.getChatsData()

    if (chats) {
      this.logger.debug('[Read] Get chats from cache')
      return chats
    }

    this.logger.debug('[Read] Get chats from db')
    return this.chatsModel.find().exec()
  }

  private async getChatsData(id?: number): Promise<GetChatsDataReturnType> {
    let chats = await this.cacheService.get('chats')

    if (!chats) {
      chats = await this.chatsModel.find().exec()
    }

    const chat = (chats || []).find(item => item.id === id)
    return { chats, chat }
  }
}

interface GetChatsDataReturnType {
  chats?: CreateChatDTO[]
  chat?: CreateChatDTO
}
