import { Document } from 'mongoose'

export interface Chat extends Document {
  readonly id: number
}
