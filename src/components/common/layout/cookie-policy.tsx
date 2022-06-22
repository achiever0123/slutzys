import { useEffect, useState } from 'react';
import {
  Button
} from 'antd';
import { postService } from 'src/services';

interface P {
  pId: string;
  hidden: boolean;
  onOk: Function;
}

export default function CookiePolicy({ pId, hidden, onOk }: P) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getCookiePolicyContent = async () => {
      try {
        setLoading(true);
        const resp = await postService.findById(pId);
        setContent(resp.data?.content || '');
      } catch {
        setContent('');
      } finally {
        setLoading(false);
      }
    };
    pId && getCookiePolicyContent();
  }, [pId]);

  if (!loading && content) {
    return (
      <div className="cookie-policy" hidden={hidden}>
        <div className="main-container cookie-box">
          {/* eslint-disable-next-line react/no-danger */}
          <div className="cookie-content" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="accept-btn">
            <Button type="primary" onClick={() => onOk()}>
              Okay
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
