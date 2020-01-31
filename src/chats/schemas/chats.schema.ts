import { Schema } from 'mongoose'

export const ChatsSchema = new Schema(
  {
    id: Number
  },
  {
    timestamps: true
  }
)
