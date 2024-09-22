import { TelegramChatModel } from './chats.model';

const PER_PAGE = 10;

export class TelegramRepository {
  getChats(page = 1) {
    return TelegramChatModel.find({})
      .limit(PER_PAGE)
      .skip((page - 1) * PER_PAGE);
  }
}
