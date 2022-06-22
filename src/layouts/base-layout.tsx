import { PureComponent } from 'react';
import { ISettings } from 'src/interfaces';
import { blockService, postService } from '@services/index';
import CookiePolicy from '@components/common/layout/cookie-policy';
import { Modal, Spin } from 'antd';
import { Popup18PlusContent } from 'src/components/common/popup-18plus-content';
import BlankLayout from './blank-layout';
import PrimaryLayout from './primary-layout';
import MaintenaceLayout from './maintenance-layout';
import GEOLayout from './geoBlocked-layout';
import PublicLayout from './public-layout';

interface IProps {
  children: any;
  settings: ISettings;
  layout: string;
}

const LayoutMap = {
  geoBlock: GEOLayout,
  maintenance: MaintenaceLayout,
  primary: PrimaryLayout,
  public: PublicLayout,
  blank: BlankLayout
};

class BaseLayout extends PureComponent<IProps> {
  state = {
    geoBlocked: false,
    cookiePolicyVisible: false,
    visiblePopup18: false,
    fetching: false,
    popupContent18: ''
  };

  async componentDidMount() {
    const { settings } = this.props;
    const { agree18, cookiePolicy } = localStorage;
    if (cookiePolicy !== 'yes' && settings?.cookiePolicyEnabled) {
      this.setState({ cookiePolicyVisible: true });
    }
    if (agree18 !== 'yes' && settings.popup18Enabled) {
      this.get18AldutContent();
      this.setState({ visiblePopup18: true });
    }
    this.checkBlockIp();
  }

  handlePopup18Ok() {
    // set cookie / local storage and hide popup
    localStorage.setItem('agree18', 'yes');
    this.setState({ visiblePopup18: false });
  }

  async get18AldutContent() {
    const { settings: { popup18ContentId } } = this.props;
    try {
      await this.setState({ fetching: true });
      const resp = popup18ContentId && await postService.findById(popup18ContentId);
      this.setState({
        popupContent18: resp?.data?.content || '',
        fetching: false
      });
    } catch {
      this.setState({ fetching: true });
    }
  }

  checkBlockIp = async () => {
    // need to check client side
    const checkBlock = await blockService.checkCountryBlock();
    if (checkBlock?.data?.blocked) {
      this.setState({ geoBlocked: true });
    }
  }

  acceptCookiePolicy = () => {
    localStorage.setItem('cookiePolicy', 'yes');
    this.setState({ cookiePolicyVisible: false });
  }

  render() {
    const {
      children, layout, settings
    } = this.props;
    const {
      cookiePolicyVisible, geoBlocked, visiblePopup18, popupContent18, fetching
    } = this.state;
    // eslint-disable-next-line no-nested-ternary
    const Container = settings.maintenanceMode ? LayoutMap.maintenance : geoBlocked ? LayoutMap.geoBlock : layout && LayoutMap[layout] ? LayoutMap[layout] : LayoutMap.primary;
    return (
      <>
        <Container>{children}</Container>
        <CookiePolicy
          hidden={!cookiePolicyVisible}
          onOk={this.acceptCookiePolicy}
          pId={settings?.cookiePolicyContentId}
        />
        <Modal
          width={990}
          centered
          maskClosable={false}
          className="adult-warning"
          visible={visiblePopup18}
          title="This website includes Adult content"
          okText="I'm at least 18 years of age"
          cancelText="Take me back"
          onOk={this.handlePopup18Ok.bind(this)}
          onCancel={() => { window.location.href = 'https://www.google.com'; }}
        >
          {/* eslint-disable-next-line react/no-danger */}
          {popupContent18 && !fetching ? <div dangerouslySetInnerHTML={{ __html: popupContent18 }} /> : <Popup18PlusContent />}
          {fetching && <div className="text-center" style={{ margin: 30 }}><Spin /></div>}
        </Modal>
      </>
    );
  }
}

export default BaseLayout;
