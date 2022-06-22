import { useState } from 'react';
import { Tooltip } from 'antd';
import { IPerformer } from 'src/interfaces';
import { Event } from 'src/socket';
import Link from 'next/link';
import { UserAddOutlined, LikeOutlined } from '@ant-design/icons';
import { TickIcon } from 'src/icons';
import { getDiffDate, shortenLargeNumber } from '@lib/index';
import './performer.less';

interface IProps {
  performer: IPerformer;
}

export const PerformerCard = ({
  performer
}: IProps) => {
  const [online, setOnline] = useState(performer.isOnline);

  const handleOnlineOffline = (data) => {
    if (data.id !== performer._id) return;
    setOnline(data.online);
  };
  return (
    <>
      <Event event="online" handler={handleOnlineOffline} />
      <Link
        href={{
          pathname: '/model/profile',
          query: { username: performer?.username || performer?._id }
        }}
        as={`/model/${performer?.username || performer?._id}`}
      >
        <a>
          <div className="model-card" style={{ backgroundImage: `url(${performer?.avatar || '/no-avatar.png'})` }}>
            <span className={online ? 'online-status active' : 'online-status'}>
              <span className="online" />
            </span>
            <div className="card-stat">
              <span>
                {shortenLargeNumber(performer?.stats.subscribers || 0)}
                {' '}
                <UserAddOutlined />
                &nbsp;&nbsp;
                {shortenLargeNumber(performer?.stats.likes || 0)}
                {' '}
                <LikeOutlined />
              </span>
              {performer?.dateOfBirth && (
              <span>
                {getDiffDate(performer?.dateOfBirth)}
                +
              </span>
              )}
            </div>
            <Tooltip title={performer?.name || performer?.username}>
              <div className="model-name">
                {performer?.name || performer?.username || 'N/A'}
                {' '}
                {performer?.verifiedAccount && <TickIcon />}
              </div>
            </Tooltip>
          </div>
        </a>
      </Link>
    </>
  );
};

export default PerformerCard;
