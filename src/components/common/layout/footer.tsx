import { PureComponent } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { IUser, IUIConfig } from 'src/interfaces';
import { withRouter } from 'next/router';

interface IProps {
  currentUser: IUser;
  ui: IUIConfig;
  router: any;
}
class Footer extends PureComponent<IProps> {
  render() {
    const { router } = this.props;
    const { ui, currentUser } = this.props;
    const menus = ui.menus.filter((m) => m.section === 'footer');
    return (
      <div className="main-footer">
        <div className="main-container">
          <ul>
            {!currentUser._id && (
              <>
                <li className={router.pathname === '/auth/login' ? 'active' : ''}>
                  <Link href="/auth/login">
                    <a>Log in</a>
                  </Link>
                </li>
                <li className={router.pathname === '/auth/register' ? 'active' : ''}>
                  <Link href={{ pathname: '/auth/register' }} as="/auth/register">
                    <a>Sign up</a>
                  </Link>
                </li>
              </>
            )}
            {menus
              && menus.length > 0
              && menus.map((item) => (
                <li key={item._id} className={router.pathname === item.path ? 'active' : ''}>
                  <a rel="noreferrer" href={item.path} target={item.isNewTab ? '_blank' : ''}>{item.title}</a>
                </li>
              ))}
          </ul>
          {/* eslint-disable-next-line react/no-danger */}
          {ui.footerContent ? <div className="footer-content" dangerouslySetInnerHTML={{ __html: ui.footerContent }} />
            : (
              <div className="copyright-text">
                <span>
                  <Link href="/home">
                    <a>{ui?.siteName}</a>
                  </Link>
                  {' '}
                  © Copyright
                  {' '}
                  {new Date().getFullYear()}
                </span>
              </div>
            )}
        </div>
      </div>
    );
  }
}
const mapState = (state: any) => ({
  currentUser: state.user.current,
  ui: state.ui
});
export default connect(mapState)(withRouter(Footer));
