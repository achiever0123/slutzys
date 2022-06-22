import { PureComponent } from 'react';
import {
  Form, Row, Col, message, Image, Alert
} from 'antd';
import { IPerformer } from 'src/interfaces';
import { performerService, authService } from '@services/index';
import './performer.less';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  user: IPerformer;
  updating: boolean;
}

export class PerformerVerificationForm extends PureComponent<IProps> {
  idVerificationFileId: string;

  documentVerificationFileId: string;

  state = {
    idImage: '',
    documentImage: ''
  }

  componentDidMount() {
    const { user } = this.props;
    if (user.documentVerification) {
      this.documentVerificationFileId = user?.documentVerification?._id;
      this.setState({ documentImage: user?.documentVerification?.url });
    }
    if (user.idVerification) {
      this.idVerificationFileId = user?.idVerification?._id;
      this.setState({ idImage: user?.idVerification?.url });
    }
  }

  onFileUploaded(type, file) {
    if (file && type === 'idFile') {
      this.idVerificationFileId = file?.response?.data?._id;
      this.setState({ idImage: file?.response?.data.url });
    }
    if (file && type === 'documentFile') {
      this.documentVerificationFileId = file?.response?.data?._id;
      this.setState({ documentImage: file?.response?.data.url });
    }
  }

  render() {
    const {
      onFinish, updating
    } = this.props;
    const {
      idImage, documentImage
    } = this.state;
    // const documentUploadUrl = performerService.getDocumentUploadUrl();
    // const headers = {
    //   authorization: authService.getToken()
    // };
    return (
      <Form
        {...layout}
        name="nest-messages"
        onFinish={(values) => {
          if (!this.idVerificationFileId || !this.documentVerificationFileId) {
            return message.error('ID documents are required', 5);
          }
          const data = { ...values };
          data.idVerificationId = this.idVerificationFileId;
          data.documentVerificationId = this.documentVerificationFileId;
          return onFinish(data);
        }}
        labelAlign="left"
        className="account-form"
      >
        <Row>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="ID photo"
              valuePropName="fileList"
              className="model-photo-verification"
              help="Your government issued ID card, National ID card, Passport or Driving license"
            >
              <div className="document-upload text-center">
                {/* <ImageUpload accept="image/*" headers={headers} uploadUrl={documentUploadUrl} onUploaded={this.onFileUploaded.bind(this, 'documentFile')} /> */}
                {documentImage ? (
                  <Image alt="id-img" src={documentImage} style={{ height: '140px' }} />
                ) : <img src="/front-id.png" height="140px" alt="id" />}
              </div>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Holding ID photo"
              valuePropName="fileList"
              className="model-photo-verification"
              help="Photo of yourself holding your indentity document next to your face"
            >
              <div className="document-upload text-center">
                {/* <ImageUpload accept="image/*" headers={headers} uploadUrl={documentUploadUrl} onUploaded={this.onFileUploaded.bind(this, 'idFile')} /> */}
                {idImage ? (
                  <Image alt="id-img" src={idImage} style={{ height: '140px' }} />
                ) : <img src="/holding-id.jpg" height="140px" alt="holding-id" />}
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Alert message={(
            <div className="text-center">
              If you wish to share updated/recent IDs to the admin, reach out through
              {' '}
              <a href="/contact">the contact page</a>
              !
            </div>
          )}
          />
        </Form.Item>
        {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button className="primary" type="primary" htmlType="submit" disabled={updating} loading={updating}>
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    );
  }
}
