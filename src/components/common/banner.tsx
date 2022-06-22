import { PureComponent } from 'react';
import { Carousel, Image, Typography } from 'antd';
import { IBanner } from '@interfaces/banner';

interface IProps {
  banners: IBanner[];
  arrows?: boolean;
  dots?: boolean;
  autoplay?: boolean;
  effect?: any;
  className?: string;
}

export class Banner extends PureComponent<IProps> {
  render() {
    const {
      banners, arrows = true, dots = false, autoplay = true, effect = 'scrollx', className
    } = this.props;
    console.log('banners', banners)
    return (
      <div style={{ marginTop: "40px" }}>
        {banners && banners.length > 0
          && (
            <Carousel
              className={className || null}
              effect={effect}
              /* adaptiveHeight */

              autoplay={autoplay}
              swipeToSlide
              arrows={arrows}
              dots={dots}
            >
              {banners.map((item) => (
                <div style={{ position: "relative" }}>
                  <a key={item?._id} href={item?.link || null} target="_.blank">
                    <Image preview={false} src={item?.photo?.url} alt="" key={item._id} ></Image>
                  </a>
                  {/* <div
                    style={{
                      position: "absolute",                      
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    <h3 style={{ color: '#fff', fontSize: "40px", fontWeight: "bold", textAlign: "center" }}>{item.title}</h3>
                    <p style={{ color: '#fff', fontSize: "16px", fontWeight: "bold", textAlign: "center" }}>{item.description}</p>
                  </div> */}
                </div>
              ))}
            </Carousel>
          )}
      </div>
    );
  }
}
