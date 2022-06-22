import { PureComponent } from 'react';
import { Spin } from 'antd';
import { IUser } from '@interfaces/index';
import CommentItem from '@components/comment/comment-item';
import { IComment } from '../../interfaces/comment';

interface IProps {
  comments: IComment[];
  total?: number;
  requesting: boolean;
  onDelete?: Function;
  user?: IUser;
  canReply?: boolean
}

export class ListComments extends PureComponent<IProps> {
  render() {
    const {
      comments, requesting, user, onDelete, canReply
    } = this.props;
    return (
      <div className="cmt-list">
        {comments.length > 0 && comments.map((comment: IComment) => <CommentItem canReply={canReply} key={comment._id} item={comment} user={user} onDelete={onDelete} />)}
        {!requesting && !comments.length && <div className="text-center" style={{ margin: 10 }}>Being the first to comment</div>}
        {requesting && <div className="text-center" style={{ margin: 10 }}><Spin /></div>}
      </div>
    );
  }
}
