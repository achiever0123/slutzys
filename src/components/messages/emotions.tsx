import { PureComponent } from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

interface IProps {
  onEmojiClick: Function;
  siteName?: string;
}

export class Emotions extends PureComponent<IProps> {
  handleClickEmoji = (emoji) => {
    const { onEmojiClick } = this.props;
    onEmojiClick(emoji.native);
  }

  render() {
    const { siteName } = this.props;

    return (
      <Picker
        onClick={this.handleClickEmoji.bind(this)}
        showSkinTones
        title={siteName || ''}
      />
    );
  }
}
