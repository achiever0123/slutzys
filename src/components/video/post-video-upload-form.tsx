import { PureComponent } from 'react';
import {
    Form, Input, InputNumber, Select, Upload, Button, Avatar,
    message, Progress, Switch, DatePicker, Row, Col, Divider
} from 'antd';
import { IUser, IVideo } from 'src/interfaces/index';
import { CameraOutlined, VideoCameraAddOutlined, FileDoneOutlined } from '@ant-design/icons';
import { performerService, getGlobalConfig } from '@services/index';
import moment from 'moment';
import { debounce } from 'lodash';
import ImageUploadElement from '@components/elements/upload';
import Router from 'next/router';
import './video.less';

const { TextArea } = Input;

interface IProps {
    user: IUser;
    video?: IVideo;
    submit: Function;
    beforeUpload?: Function;
    uploading?: boolean;
    uploadPercentage?: number;
}

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
};

const { Option } = Select;

const validateMessages = {
    required: 'This field is required!'
};

export class FormUploadPostVideo extends PureComponent<IProps> {
    state = {
        currentTab: 'video',
        previewThumbnail: null,
        previewTeaser: null,
        previewVideo: null,
        selectedThumbnail: null,
        selectedVideo: null,
        selectedTeaser: null,
        isSale: false,
        isSchedule: false,
        scheduledAt: moment(),
        performers: [],
        firstLoadPerformer: false
    };

    componentDidMount() {
        const { video, user } = this.props;
        if (video) {
            this.setState(
                {
                    previewThumbnail: video?.thumbnail?.url || '',
                    previewVideo: video?.video?.url || '',
                    previewTeaser: video?.teaser?.url || '',
                    isSale: video.isSaleVideo,
                    isSchedule: video.isSchedule,
                    scheduledAt: video.scheduledAt ? moment(video.scheduledAt) : moment()
                }
            );
        }
        this.getPerformers('', video?.participantIds || [user._id]);
    }

    onSwitch(field: string, checked: boolean) {
        if (field === 'saleVideo') {
            this.setState({
                isSale: checked
            });
        }
        if (field === 'scheduling') {
            this.setState({
                isSchedule: checked
            });
        }
    }

    getPerformers = debounce(async (q, performerIds) => {
        try {
            const resp = await (await performerService.search({ q, performerIds: performerIds || '', limit: 500 })).data;
            const performers = resp.data || [];
            this.setState({ performers, firstLoadPerformer: true });
        } catch (e) {
            const err = await e;
            message.error(err?.message || 'Error occured');
            this.setState({ firstLoadPerformer: true });
        }
    }, 500);

    beforeUpload(file: File, field: string) {
        const { beforeUpload: beforeUploadHandler } = this.props;
        if (field === 'thumbnail') {
            const isValid = file.size / 1024 / 1024 < (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5);
            if (!isValid) {
                message.error(`File is too large please provide an file ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB or below`);
                return isValid;
            }
            this.setState({ selectedThumbnail: file });
        }
        if (field === 'teaser') {
            const isValid = file.size / 1024 / 1024 < (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_TEASER || 200);
            if (!isValid) {
                message.error(`File is too large please provide an file ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_TEASER || 200}MB or below`);
                return isValid;
            }
            this.setState({ selectedTeaser: file });
        }
        if (field === 'video') {
            const isValid = file.size / 1024 / 1024 < (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_VIDEO || 2000);
            if (!isValid) {
                message.error(`File is too large please provide an file ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_VIDEO || 2000}MB or below`);
                return isValid;
            }
            this.setState({ selectedVideo: file });
        }
        return beforeUploadHandler(file, field);
    }

    onTabChage = (tab) => {
        this.setState({
            currentTab: tab
        });
    }

    render() {
        const {
            video, submit, uploading, uploadPercentage, user
        } = this.props;
        const {
            currentTab,
            previewThumbnail,
            previewTeaser,
            previewVideo,
            performers,
            isSale,
            isSchedule,
            scheduledAt,
            selectedThumbnail,
            selectedTeaser,
            selectedVideo,
            firstLoadPerformer
        } = this.state;
        return (
            <Form
                /* {...layout} */
                onFinish={(values) => {
                    const data = values;
                    if (isSchedule) {
                        data.scheduledAt = scheduledAt;
                    }
                    console.log('data 1', { ...data, tags: ['saleVideo'], participantIds: ['62500ee8807cb4a602ff3459'] })
                    submit({ ...data, tags: ['saleVideo'], participantIds: ['62500ee8807cb4a602ff3459'] });
                }}
                onFinishFailed={() => message.error('Please complete the required fields')}
                name="form-upload"
                validateMessages={validateMessages}
                initialValues={
                    video
                    || ({
                        title: '',
                        price: 9.99,
                        description: '',
                        tags: [],
                        isSaleVideo: false,
                        participantIds: [user._id],
                        isSchedule: false,
                        status: 'active'
                    })
                }
                className="account-form"
            >
                <Form.Item
                    name="title"
                    rules={[
                        { required: true, message: 'Please input title of video!' }
                    ]}
                >
                    <Input placeholder="Title" />
                </Form.Item>
                <Form.Item name="description">
                    <TextArea
                        name="description"
                        /* label="Description" */
                        className="post-card-textarea"
                        rows={4}
                        placeholder="Post photo or videos"
                        maxLength={6}
                    />
                </Form.Item>
                <Row>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <div className="button-tab-wrapper">
                            <div
                                className={`tab-button ${currentTab === "video" && "active"}`}
                            >
                                <Button type="primary" onClick={() => this.setState({
                                    currentTab: "video"
                                })}>
                                    Video
                                </Button>
                            </div>
                            <div
                                className={`tab-button ${currentTab === "thumbnail" && "active"}`}
                            >
                                <Button type="primary" onClick={() => this.setState({
                                    currentTab: "thumbnail"
                                })}>
                                    Thumbnail
                                </Button>
                            </div>
                            <div
                                className={`tab-button ${currentTab === "tag" && "active"}`}
                            >
                                <Button type="primary" onClick={() => this.setState({
                                    currentTab: "tag"
                                })}>
                                    Tag
                                </Button>
                            </div>
                            <div
                                className={`tab-button ${currentTab === "type" && "active"}`}
                            >
                                <Button type="primary" onClick={() => this.setState({
                                    currentTab: "type"
                                })}>
                                    Post type
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                {currentTab === "video" &&
                    <Row>
                        <Col xs={12} md={12}>
                            <Form.Item
                                label="Video File"
                            >
                                <Upload
                                    customRequest={() => false}
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    accept="video/*"
                                    multiple={false}
                                    showUploadList={false}
                                    disabled={uploading}
                                    beforeUpload={(file) => this.beforeUpload(file, 'video')}
                                >
                                    {selectedVideo ? <FileDoneOutlined /> : <VideoCameraAddOutlined />}
                                </Upload>
                                <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
                                    {(selectedVideo && <a>{selectedVideo.name}</a>)
                                        || (previewVideo && (
                                            <a href={previewVideo} target="_blank" rel="noreferrer">
                                                Click here to preview video
                                            </a>
                                        ))
                                        || `Video file is ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_VIDEO || 2048}MB or below`}
                                </div>
                            </Form.Item>
                        </Col>
                        <Col xs={12} md={12}>
                            <Form.Item
                                label="Teaser file"
                            >
                                <Upload
                                    customRequest={() => false}
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    accept="video/*"
                                    multiple={false}
                                    showUploadList={false}
                                    disabled={uploading}
                                    beforeUpload={(file) => this.beforeUpload(file, 'teaser')}
                                >
                                    {selectedTeaser ? <FileDoneOutlined /> : <VideoCameraAddOutlined />}
                                </Upload>
                                <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
                                    {(selectedTeaser && <a>{selectedTeaser.name}</a>)
                                        || (previewTeaser
                                            && (
                                                <a href={previewTeaser} target="_blank" rel="noreferrer">
                                                    Click here to preview teaser
                                                </a>
                                            )
                                        )
                                        || `Teaser is ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_TEASER || 200}MB or below`}
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                }
                {currentTab === "thumbnail" &&
                    <>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Thumbnail"
                            >
                                <ImageUploadElement
                                    imageFile={selectedThumbnail}
                                    isDisabled={uploading}
                                    beforeUpload={(file, fileList) => { console.log('imageFile 3', file); console.log('imageFile 4', fileList); this.beforeUpload(file, 'thumbnail') }}
                                />
                                {/* <Upload
                                    customRequest={() => false}
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    accept="image/*"
                                    multiple={false}
                                    showUploadList={false}
                                    disabled={uploading}
                                    beforeUpload={(file) => this.beforeUpload(file, 'thumbnail')}
                                >
                                    {selectedThumbnail ? <FileDoneOutlined /> : <CameraOutlined />}
                                </Upload>
                                <div className="ant-form-item-explain" style={{ textAlign: 'left' }}>
                                    {(selectedThumbnail && <a>{selectedThumbnail.name}</a>)
                                        || (previewThumbnail && (
                                            <a href={previewThumbnail} target="_blank" rel="noreferrer">
                                                Click here to preview thumbnail
                                            </a>
                                        ))
                                        || `Thumbnail is ${getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB or below`}
                                </div> */}
                            </Form.Item>
                        </Col>
                    </>
                }
                {currentTab === "tag" &&
                    <>
                        <Form.Item /* label="Tags" */ name="tags">
                            <Select
                                mode="tags"
                                placeholder="Select tags"
                                style={{ width: '100%' }}
                                size="middle"
                                showArrow={false}
                                defaultActiveFirstOption={false}
                            />
                        </Form.Item>
                        <Form.Item
                            /* label="Participants" */
                            name="participantIds"
                        >
                            {firstLoadPerformer && (
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    showSearch
                                    placeholder="Search performers here"
                                    optionFilterProp="children"
                                    onSearch={this.getPerformers.bind(this)}
                                    loading={uploading}
                                >
                                    {performers
                                        && performers.length > 0
                                        && performers.map((p) => (
                                            <Option key={p._id} value={p._id}>
                                                <Avatar src={p?.avatar || '/no-avatar.png'} />
                                                {' '}
                                                {p?.name || p?.username || 'N/A'}
                                            </Option>
                                        ))}
                                </Select>
                            )}
                        </Form.Item>
                    </>
                }
                {currentTab === "type" &&
                    <>
                        <Row>
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="isSaleVideo"
                                    label="For sale?"
                                >
                                    <Switch
                                        checkedChildren="Pay per view"
                                        unCheckedChildren="Subscribe to view"
                                        checked={isSale}
                                        onChange={this.onSwitch.bind(this, 'saleVideo')}
                                    />
                                </Form.Item>
                            </Col>
                            {isSale && (
                                <Col md={12} xs={12}>
                                    <Form.Item name="price" label="Price">
                                        <InputNumber style={{ width: '100%' }} min={1} />
                                    </Form.Item>
                                </Col>
                            )}
                            <Col md={12} xs={12}>
                                <Form.Item
                                    name="isSchedule"
                                    label="Schedule?"
                                >
                                    <Switch
                                        checkedChildren="Upcoming"
                                        unCheckedChildren="Recent"
                                        checked={isSchedule}
                                        onChange={this.onSwitch.bind(this, 'scheduling')}
                                    />
                                </Form.Item>
                            </Col>
                            {isSchedule && (
                                <Col md={12} xs={12}>
                                    <Form.Item label="Schedule at">
                                        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            disabledDate={(currentDate) => currentDate && currentDate < moment().endOf('day')}
                                            defaultValue={scheduledAt}
                                            onChange={(val) => this.setState({ scheduledAt: val })}
                                        />
                                    </Form.Item>
                                </Col>
                            )}
                            <Col md={24} xs={12}>
                                <Form.Item
                                    name="status"
                                    label="Status"
                                    rules={[{ required: true, message: 'Please select status!' }]}
                                >
                                    <Select>
                                        <Select.Option key="active" value="active">
                                            Active
                                        </Select.Option>
                                        <Select.Option key="inactive" value="inactive">
                                            Inactive
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                        </Row>
                    </>
                }
                {uploadPercentage ? (
                    <Progress percent={Math.round(uploadPercentage)} />
                ) : null}
                <div className='post-card-footer-divider'>
                    <Divider />
                </div>
                <Row className="post-btn-wrapper">
                    <Col span={24} style={{ textAlign: "right" }}>
                        <Form.Item>
                            <Button
                                /* type="primary" */
                                className="primary"
                                htmlType="submit"
                                loading={uploading}
                                disabled={uploading}
                            >
                                {video ? 'Update' : 'Upload'}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}
