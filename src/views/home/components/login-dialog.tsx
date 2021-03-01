import {
  Badge,
  Button,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Dropdown,
  Empty,
  Form,
  FormInstance,
  Input,
  Menu,
  Modal,
  Row,
  Space,
  Statistic,
  Timeline,
} from 'antd';
import { PlusOutlined, FieldTimeOutlined } from '@ant-design/icons';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SparkMD5 = require('spark-md5');

/**
 * 组件最终接收的所有 Props 类型声明
 */
type LoginProps = {
  isModalVisible: boolean;
  onClose: () => any;
  setLogin: () => any;
};

export default class Login extends React.Component<LoginProps, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formRef = React.createRef() as React.RefObject<FormInstance<any>>;

  onFinish = () => {
    const value = this.formRef.current.getFieldsValue();
    const token = SparkMD5.hash(`${value.username}${value.password}`);
    console.log('token', token);

    localStorage.setItem('token', token);
    this.props.setLogin();
    this.props.onClose();
  };

  handleOk = () => {
    this.formRef.current.submit();
  };

  handleCancel = () => {
    this.props.onClose();
  };

  render() {
    const { isModalVisible } = this.props;

    return (
      <section>
        <Modal
          title="Basic Modal"
          visible={isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form
            name="box-form"
            ref={this.formRef}
            layout="vertical"
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </Form>
        </Modal>
      </section>
    );
  }
}
