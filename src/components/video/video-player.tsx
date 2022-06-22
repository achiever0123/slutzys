import { PureComponent } from 'react';
import videojs from 'video.js';
import 'node_modules/video.js/dist/video-js.css';

export class VideoPlayer extends PureComponent<any> {
  videoNode: HTMLVideoElement;

  player: any;

  state = {
    isPlayed: false
  }

  componentDidMount() {
    this.player = videojs(this.videoNode, { ...this.props });
    this.player.on('play', this.handleOnPlay);
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
      this.player.off('play', this.handleOnPlay);
    }
  }

  handleOnPlay = () => {
    const { isPlayed } = this.state;
    const { onPlay } = this.props;
    if (isPlayed) return;
    !isPlayed && this.setState({ isPlayed: true });
    onPlay && onPlay();
  }

  render() {
    return (
      <div className="videojs-player">
        <div data-vjs-player>
          <video ref={(node) => { this.videoNode = node; }} className="video-js" />
        </div>
      </div>
    );
  }
}
