import { PureComponent, createRef } from 'react';
import {
  Spin, Button, Avatar, message as toasty
} from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { TickIcon } from 'src/icons';
import { loadMoreMessages, deactiveConversation } from '@redux/message/actions';
import {
  IConversation, IUser, ISettings
} from '@interfaces/index';
import { SubscriptionPerformerBlock } from '@components/performer';
import { paymentService } from 'src/services';
import Router from 'next/router';
import Compose from './Compose';
import Message from './Message';
import './MessageList.less';

interface IProps {
  sendMessage: any;
  deactiveConversation: Function;
  loadMoreMessages: Function;
  message: any;
  conversation: IConversation;
  currentUser: IUser;
  settings: ISettings;
}

class MessageList extends PureComponent<IProps> {
  messagesRef: any;

  state = {
    offset: 0,
    submiting: false
  }

  async componentDidMount() {
    if (!this.messagesRef) this.messagesRef = createRef();
  }

  async componentDidUpdate(prevProps) {
    const { conversation, message, sendMessage } = this.props;
    if (prevProps.conversation && prevProps.conversation._id !== conversation._id) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ offset: 0 });
    }
    if ((prevProps.message.total === 0 && message.total !== 0) || (prevProps.message.total === message.total)) {
      if (prevProps.sendMessage?.data?._id !== sendMessage?.data?._id) {
        this.scrollToBottom(true);
        return;
      }
      this.scrollToBottom(false);
    }
  }

  handleSubscribe = async (paymentGateway = 'ccbill', type = 'monthly') => {
    const { conversation } = this.props;
    try {
      await this.setState({ submiting: true });
      const resp = await (
        await paymentService.subscribe({ type, performerId: conversation?.recipientInfo?._id, paymentGateway })
      ).data;
      toasty.info('Redirecting to payment gateway, do not reload page at this time', 30);
      if (['ccbill', 'verotel'].includes(paymentGateway)) window.location.href = resp.paymentUrl;
    } catch (e) {
      const err = await e;
      toasty.error(err?.message || 'error occured, please try again later');
      this.setState({ submiting: false });
    }
  }

  async handleScroll(conversation, event) {
    const { message, loadMoreMessages: handleLoadMore } = this.props;
    const { offset } = this.state;
    const { fetching, items, total } = message;
    const canloadmore = total > items.length;
    const ele = event.target;
    if (!canloadmore) return;
    if (ele.scrollTop === 0 && conversation._id && !fetching && canloadmore) {
      this.setState({ offset: offset + 1 },
        () => {
          const { offset: newOffset } = this.state;
          handleLoadMore({ conversationId: conversation._id, limit: 25, offset: newOffset * 25 });
        });
    }
  }

 renderMessages = () => {
   const { message, currentUser, conversation } = this.props;
   const recipientInfo = conversation && conversation.recipientInfo;
   const messages = message.items;
   let i = 0;
   const messageCount = messages.length;
   const tempMessages = [];
   while (i < messageCount) {
     const previous = messages[i - 1];
     const current = messages[i];
     const next = messages[i + 1];
     const isMine = current.senderId === currentUser._id;
     const currentMoment = moment(current.createdAt);
     let prevBySameAuthor = false;
     let nextBySameAuthor = false;
     let startsSequence = true;
     let endsSequence = true;
     let showTimestamp = true;

     if (previous) {
       const previousMoment = moment(previous.createdAt);
       const previousDuration = moment.duration(
         currentMoment.diff(previousMoment)
       );
       prevBySameAuthor = previous.senderId === current.senderId;

       if (prevBySameAuthor && previousDuration.as('hours') < 1) {
         startsSequence = false;
       }

       if (previousDuration.as('hours') < 1) {
         showTimestamp = false;
       }
     }

     if (next) {
       const nextMoment = moment(next.createdAt);
       const nextDuration = moment.duration(nextMoment.diff(currentMoment));
       nextBySameAuthor = next.senderId === current.senderId;

       if (nextBySameAuthor && nextDuration.as('hours') < 1) {
         endsSequence = false;
       }
     }
     if (current._id) {
       tempMessages.push(
         <Message
           key={i}
           isMine={isMine}
           startsSequence={startsSequence}
           endsSequence={endsSequence}
           showTimestamp={showTimestamp}
           data={current}
           recipient={recipientInfo}
           currentUser={currentUser}
         />
       );
     }
     // Proceed to the next message.
     i += 1;
   }
   return tempMessages;
 };

 scrollToBottom(toBot = true) {
   const { message: { fetching } } = this.props;
   const { offset } = this.state;
   if (!fetching && this.messagesRef && this.messagesRef.current) {
     const ele = this.messagesRef.current;
     window.setTimeout(() => {
       ele.scrollTop = toBot ? ele.scrollHeight : (ele.scrollHeight / (offset + 1) - 150);
     }, 300);
   }
 }

 render() {
   const {
     conversation, message, deactiveConversation: handleDeactiveConversation, settings
   } = this.props;
   const { submiting } = this.state;
   const { fetching } = message;
   return (
     <div className="message-list" ref={this.messagesRef} onScroll={this.handleScroll.bind(this, conversation)}>
       {conversation && conversation._id
         ? (
           <>
             <div className="message-list-container">
               <div className="mess-recipient">
                 <span
                   className="profile"
                   aria-hidden
                   onClick={() => conversation?.recipientInfo?.isPerformer
                 && Router.push({
                   pathname: '/model/profile',
                   query: { username: conversation?.recipientInfo?.username || conversation?.recipientInfo?._id }
                 }, `/model/${conversation?.recipientInfo?.username || conversation?.recipientInfo?._id}`)}
                 >
                   <Avatar alt="avatar" src={conversation?.recipientInfo?.avatar || '/no-avatar.png'} />
                   {' '}
                   {conversation?.recipientInfo?.name || conversation?.recipientInfo?.username || 'N/A'}
                   {' '}
                   {conversation?.recipientInfo?.verifiedAccount && <TickIcon />}
                 </span>
                 <Button onClick={() => handleDeactiveConversation()} className="close-btn">
                   <ArrowLeftOutlined />
                   {' '}
                 </Button>
               </div>
               {fetching && <div className="text-center"><Spin /></div>}
               {conversation?.isSubscribed && this.renderMessages()}
               {!conversation?.isSubscribed && (
                 <SubscriptionPerformerBlock settings={settings} onSelect={this.handleSubscribe} disabled={submiting || (!settings?.ccbillEnabled && !settings?.verotelEnabled)} performer={conversation?.recipientInfo} />
               )}
               {conversation.isBlocked && <div className="sub-text">This model has blocked you!</div>}
             </div>
           </>
         )
         : <div className="sub-text">You have not initiated any conversations yet. Don&apos;t be shy, take the first step. You never know where the roads lead.</div>}
       <Compose disabled={!conversation?._id || !conversation?.isSubscribed || conversation?.isBlocked} conversation={conversation} />
     </div>
   );
 }
}

const mapStates = (state: any) => {
  const { conversationMap, sendMessage } = state.message;
  const { activeConversation } = state.conversation;
  const messages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].items || []
    : [];
  const totalMessages = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].total || 0
    : 0;
  const fetching = conversationMap[activeConversation._id]
    ? conversationMap[activeConversation._id].fetching || false : false;
  return {
    sendMessage,
    message: {
      items: messages,
      total: totalMessages,
      fetching
    },
    conversation: activeConversation,
    currentUser: state.user.current,
    settings: state.settings
  };
};

const mapDispatch = { loadMoreMessages, deactiveConversation };
export default connect(mapStates, mapDispatch)(MessageList);
