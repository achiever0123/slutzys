import { PureComponent } from 'react';
import { connect } from 'react-redux';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import './Messenger.less';

interface IProps {
  toSource?: string;
  toId?: string;
  activeConversation?: any;
}

class Messenger extends PureComponent<IProps> {
  render() {
    const { toSource, toId, activeConversation } = this.props;
    return (
      <div className="messenger">
        <div className={!activeConversation._id ? 'sidebar' : 'sidebar active'}>
          <ConversationList toSource={toSource} toId={toId} />
        </div>
        <div className={!activeConversation._id ? 'chat-content' : 'chat-content active'}>
          <MessageList />
        </div>
      </div>
    );
  }
}
const mapStates = (state: any) => {
  const { activeConversation } = state.conversation;
  return {
    activeConversation
  };
};

const mapDispatch = { };
export default connect(mapStates, mapDispatch)(Messenger);
