export interface IConversation {
  _id: string;

  type: string;

  name: string;

  recipients: any;

  lastMessage: string;

  lastSenderId: string;

  lastMessageCreatedAt: Date;

  meta: any;

  createdAt: Date;

  updatedAt: Date;

  recipientInfo: any;

  totalNotSeenMessages: number;

  isSubscribed: boolean;

  isBlocked: boolean;
}

export interface IMessage {
  _id: string;

  conversationId: string;

  type: string;

  fileId: string;

  text: string;

  senderId: string;

  meta: any;

  createdAt: Date;

  updatedAt: Date;

  imageUrl: string;

  senderInfo: any
}
