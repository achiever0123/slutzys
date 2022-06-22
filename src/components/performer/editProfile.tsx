import { PureComponent } from 'react';
import Head from 'next/head';
import { connect } from 'react-redux';
import {
    Layout, Tabs, message, PageHeader
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import Router from 'next/router';
import {
    IPerformer, IUIConfig
} from 'src/interfaces';
import {
    updatePerformer, updateCurrentUserAvatar, updateCurrentUserCover
} from 'src/redux/user/actions';
import {
    authService, performerService, utilsService
} from '@services/index';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import {
    PerformerSubscriptionForm, PerformerVerificationForm, PerformerAccountForm,
    PerformerBankingForm, PerformerPaypalForm
} from '@components/performer';
import { AccountEditForm } from "@components/performer/accountEditForm";

interface IProps {
    ui: IUIConfig;
    currentUser: IPerformer;
    updatePerformer: Function;
    updating: boolean;
    updateCurrentUserAvatar: Function;
    updateCurrentUserCover: Function;
    phoneCodes: any;
    languages: any;
    countries: any;
    bodyInfo: any;
}

class AccountSettings extends PureComponent<IProps> {
    static authenticate = true;

    static onlyPerformer = true;

    /* static async getInitialProps() {
        const [countries, phoneCodes, languages, bodyInfo] = await Promise.all([
            utilsService.countriesList(),
            utilsService.phoneCodesList(),
            utilsService.languagesList(),
            utilsService.bodyInfo()
        ]);
        return {
            countries: countries?.data || [],
            phoneCodes: phoneCodes?.data || [],
            languages: languages?.data || [],
            bodyInfo: bodyInfo?.data
        };
    } */

    state = {
        submiting: false
    }

    onCoverUploaded = (data: any) => {
        const {
            updateCurrentUserCover: updateCurrentUserCoverHandler
        } = this.props;
        message.success('Changes saved.');
        updateCurrentUserCoverHandler(data.response.data.url);
    }

    onAvatarUploaded = (data: any) => {
        const {
            updateCurrentUserAvatar: updateCurrentUserAvatarHandler
        } = this.props;
        message.success('Changes saved.');
        updateCurrentUserAvatarHandler(data.response.data.url);
    }

    handleUpdateBanking = async (data) => {
        try {
            this.setState({ submiting: true });
            const { currentUser } = this.props;
            const info = { ...data, performerId: currentUser._id };
            await performerService.updateBanking(currentUser._id, info);
            this.setState({ submiting: false });
            message.success('Banking account was updated successfully!');
        } catch (error) {
            this.setState({ submiting: false });
            const err = await error;
            message.error(err?.message || 'An error orccurred, please try again.');
        }
    }

    handleUpdatePaypal = async (data) => {
        const { currentUser } = this.props;
        try {
            this.setState({ submiting: false });
            const payload = { key: 'paypal', value: data, performerId: currentUser._id };
            await performerService.updatePaymentGateway(currentUser._id, payload);
            message.success('Paypal account was updated successfully!');
            this.setState({ submiting: false });
        } catch (e) {
            const err = await e;
            message.error(err?.message || 'Error occured, please try againl later');
            this.setState({ submiting: false });
        }
    }

    submit = async (data: any) => {
        try {
            const {
                currentUser, updatePerformer: updatePerformerHandler
            } = this.props;
            updatePerformerHandler({
                ...currentUser,
                ...data
            });
            message.success('Changes saved.');
        } catch (error) {
            const err = await Promise.resolve(error);
            message.error(err?.message || 'Something went wrong, please try again.');
        }
    }

    updatePassword = async (data: any) => {
        try {
            this.setState({ submiting: true });
            await authService.updatePassword(data.password, 'performer');
            message.success('Changes saved.');
        } catch (e) {
            message.error('An error occurred, please try again!');
        } finally {
            this.setState({ submiting: false });
        }
    }

    render() {
        const {
            currentUser, updating, ui, phoneCodes, languages, bodyInfo, countries
        } = this.props;
        const { submiting } = this.state;
        const uploadHeaders = {
            authorization: authService.getToken()
        };
        return (
            <>
                {/* <Layout>
                    <Head>
                        <title>
                            {`${ui.siteName} | Edit Profile`}
                        </title>
                    </Head>
                    <div className="main-container user-account">
                        <PageHeader
                            onBack={() => Router.back()}
                            backIcon={<ArrowLeftOutlined />}
                            title="Edit Profile"
                        />
                        {!currentUser.verifiedDocument && (
                            <div className="verify-info">
                                Your ID documents are not verified yet! You could not post any content right now.
                                <p>
                                    If you have any question, please contact our administrator to get more information.
                                </p>
                            </div>
                        )} */}
                <Tabs
                    defaultActiveKey="basic"
                    tabPosition="top"
                    className="nav-tabs"
                >
                    <Tabs.TabPane tab={<span>Profile</span>} key="basic">
                        <AccountEditForm
                            onFinish={this.submit.bind(this)}
                            user={currentUser}
                            updating={updating}
                            options={{
                                uploadHeaders,
                                avatarUploadUrl: performerService.getAvatarUploadUrl(),
                                onAvatarUploaded: this.onAvatarUploaded.bind(this),
                                coverUploadUrl: performerService.getCoverUploadUrl(),
                                onCoverUploaded: this.onCoverUploaded.bind(this),
                                videoUploadUrl: performerService.getVideoUploadUrl()
                            }}
                            countries={countries}
                            phoneCodes={phoneCodes}
                            languages={languages}
                            bodyInfo={bodyInfo}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span>ID Documents</span>} key="verification">
                        <PerformerVerificationForm
                            onFinish={this.submit.bind(this)}
                            updating={updating}
                            user={currentUser}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={<span>Subscriptions</span>}
                        key="subscription"
                    >
                        <PerformerSubscriptionForm
                            onFinish={this.submit.bind(this)}
                            updating={updating}
                            user={currentUser}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={<span>Banking</span>}
                        key="banking"
                    >
                        <PerformerBankingForm
                            onFinish={this.handleUpdateBanking.bind(this)}
                            updating={submiting}
                            user={currentUser}
                            countries={countries}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={<span>Paypal</span>}
                        key="paypal"
                    >
                        <PerformerPaypalForm
                            onFinish={this.handleUpdatePaypal.bind(this)}
                            updating={submiting}
                            user={currentUser}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span>Password</span>} key="password">
                        <UpdatePaswordForm
                            onFinish={this.updatePassword.bind(this)}
                            updating={submiting}
                        />
                    </Tabs.TabPane>
                </Tabs>
                {/*  </div>
                </Layout> */}
            </>
        );
    }
}

const mapStates = (state: any) => ({
    currentUser: state.user.current,
    updating: state.user.updating,
    ui: state.ui
});
const mapDispatch = {
    updatePerformer,
    updateCurrentUserAvatar,
    updateCurrentUserCover
};
export default connect(mapStates, mapDispatch)(AccountSettings);
