import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Divider,
  Card,
  Avatar,
  Input,
  Button,
  Switch,
  message,
  Form,
  Select,
  Upload,
} from "antd";
import { MdMoreVert } from "react-icons/md";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaComment, FaRegComment } from "react-icons/fa";
import { RiShareForwardLine, RiShareForwardFill } from "react-icons/ri";
import DropzoneComponent from "@components/common/DropzoneComponent.js";
import Router from "next/router";
import { photoService } from "@services/index";
import { galleryService, getGlobalConfig } from "src/services";
import { getResponseError } from "@lib/utils";
import "./add-post.less";

const { Dragger } = Upload;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const AddPostComponent = () => {
  const { TextArea } = Input;
  const [currentTab2, setCurrentTab2] = useState("image");
  const onChangeTab2 = (tab) => {
    setCurrentTab2(tab);
  };

  const [form] = Form.useForm();
  const [submiting, setSubmiting] = useState(false);

  const [filesList, setFilesList] = useState([]);
  const isSubmiting = submiting;

  /* const onUploading = (file, resp) => {
    // eslint-disable-next-line no-param-reassign
    file.percent = resp.percentage;
    this.forceUpdate();
  }; */

  /* const handleUploadPhotos = async (id) => {
    const data = {
      galleryId: id,
      status: "active",
    };
    console.log("upload data", data);
    const uploadFiles = filesList.filter(
      (f) => !f._id && !["uploading", "done"].includes(f.status)
    );
    console.log("upload uploadFiles", uploadFiles);
    // eslint-disable-next-line no-restricted-syntax
    for (const file of uploadFiles) {
      try {
        // eslint-disable-next-line no-continue
        if (["uploading", "done"].includes(file.status)) continue;
        file.status = "uploading";
        console.log("upload file", file);
        // eslint-disable-next-line no-await-in-loop
        await photoService.uploadImages(file, data, onUploading(this, file));
        console.log("upload file done", file);
        file.status = "done";
        file.response = { status: "success" };
      } catch (e) {
        file.status = "error";
        message.error(`File ${file?.name} error!`);
      }
    }
  }; */

  const onFinish = async (data) => {
    console.log("data 1: ", data);
    /* try {
      setSubmiting(true);
      const result = await galleryService.create({
        ...data,
        name: "single_post",
      });
      console.log("data", data);
      await handleUploadPhotos(result.data._id);
      console.log("uploaded");
      //console.log("result: ", result);
      message.success("Created successfully!");
      //Router.push("/model/my-gallery/listing");
    } catch (e) {
      setSubmiting(false);
      message.error(
        getResponseError(await e) || "An error occurred, please try again!"
      );
    } */
  };

  /* const beforeUpload = async (file, files) => {
    if (
      file.size / 1024 / 1024 >
      (getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5)
    ) {
      message.error(
        `${file.name} is over ${
          getGlobalConfig().NEXT_PUBLIC_MAX_SIZE_IMAGE || 5
        }MB`
      );
      return false;
    }
    getBase64(file, (imageUrl) => {
      // eslint-disable-next-line no-param-reassign
      file.thumbUrl = imageUrl;
    });
    setFilesList([...filesList, ...files]);
    return true;
  }; */

  /* const removePhoto = async (file) => {
    if (!file._id) {
      setFilesList(filesList.filter((f) => f?.uid !== file?.uid));
      return;
    }
    if (!window.confirm("Are you sure to remove this photo?")) return;
    try {
      await setSubmiting(true);
      await photoService.delete(file._id);
      message.success("Deleted success");
      setFilesList(filesList.filter((p) => p._id !== file._id));
      setSubmiting(false);
    } catch (error) {
      message.error(
        getResponseError(await error) ||
          "Something went wrong, please try again later"
      );
      setSubmiting(false);
    }
  }; */

  /* const setCover = async (file) => {
    if (!file._id) {
      return;
    }
    try {
      await setSubmiting(true);
      await photoService.setCoverGallery(file._id);
      message.success("Updated cover successfully!");
      //this.getPhotosInGallery();
    } catch (error) {
      message.error(getResponseError(await error));
    } finally {
      setSubmiting(false);
    }
  }; */

  return (
    <div>
      <Form
        form={form}
        name="postForm"
        onFinish={onFinish}
        initialValues={{ name: "", status: "active", description: "" }}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        className="account-form"
      >
        <Form.Item name="description">
          <TextArea
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
                className={`tab-button ${currentTab2 === "image" && "active"}`}
              >
                <Button type="primary" onClick={() => onChangeTab2("image")}>
                  Image
                </Button>
              </div>
              <div
                className={`tab-button ${currentTab2 === "video" && "active"}`}
              >
                <Button type="primary" onClick={() => onChangeTab2("video")}>
                  Video
                </Button>
              </div>
              <div
                className={`tab-button ${currentTab2 === "tag" && "active"}`}
              >
                <Button type="primary" onClick={() => onChangeTab2("tag")}>
                  Tag
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        {/* <DropzoneComponent className="post-card-image-drop" /> */}

        {/* <Dragger
          customRequest={() => false}
          accept="image/*"
          multiple
          showUploadList={false}
          listType="picture"
          disabled={isSubmiting}
          beforeUpload={beforeUpload}
        >
          <p className="ant-upload-text">
            Drag & drop files to this area or browser to upload
          </p>
        </Dragger> */}

        {/* {filesList && filesList.length > 0 && (
          <PhotoUploadList
            files={filesList}
            setCover={setCover && setCover.bind(this)}
            remove={removePhoto && removePhoto.bind(this)}
          />
        )} */}

        <Row className="post-btn-wrapper">
          <Col span={24} style={{ textAlign: "left" }}>
            <Switch
              defaultChecked
              onChange={(checked) => console.log(checked)}
            />
            <span className="swith-label">Premium</span>
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <Form.Item>
              <Button
                type="primary"
                /* className="primary" */
                htmlType="submit"
                loading={isSubmiting}
                disabled={isSubmiting}
              >
                Post
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddPostComponent;
