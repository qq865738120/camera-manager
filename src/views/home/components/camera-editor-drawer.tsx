import React from 'react';
import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  message,
  Select,
} from 'antd';
import { api } from '@src/services/api';

type CameraEditorDrawerProps = {
  visible: boolean;
  item: any;
  boxItem: any;
  list: any;
  action: 'add' | 'delete' | 'update';
  onClose: () => any;
  onFinish: () => any;
};

export class CameraEditorDrawer extends React.Component<
  CameraEditorDrawerProps,
  {}
> {
  constructor(props) {
    super(props);
  }

  formRef = React.createRef() as React.RefObject<FormInstance<any>>;

  componentDidUpdate() {
    const { action, item, boxItem } = this.props;
    if (!this.formRef.current) {
      return;
    }

    if (action === 'add') {
      this.formRef.current.setFieldsValue({
        name: '',
        ip: '',
        boxIP: boxItem.ip,
      });
    } else if (action === 'update') {
      this.formRef.current.setFieldsValue({
        name: item.name,
        ip: item.ip,
        boxIP: boxItem.ip,
      });
    }
  }

  onFinish = async () => {
    const { onClose, action } = this.props;
    console.log('finish');
    const value = this.formRef.current.getFieldsValue();
    try {
      if (action === 'add') {
        await api.home.postCameraAdd(value);
      } else {
        await api.home.postCameraUpdate(value);
      }
      message.success('操作成功');
      this.props.onFinish();
    } catch (error) {
      console.log(error);
    }
    console.log(value);
    onClose();
  };

  render() {
    const { visible, onClose, item, action, list, boxItem } = this.props;

    return (
      <Drawer
        title={`${action === 'add' ? '新增' : '修改'}相机`}
        width={400}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button
              onClick={() => this.formRef.current.submit()}
              type="primary"
              htmlType="submit"
            >
              提交
            </Button>
          </div>
        }
      >
        <Form
          name="camera-form"
          ref={this.formRef}
          layout="vertical"
          initialValues={action === 'update' ? item : { boxIP: boxItem?.ip }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            name="ip"
            label="IP地址"
            rules={[
              { required: true, message: '请输入IP地址' },
              {
                pattern: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g,
                message: '请输入正确的IP地址',
              },
            ]}
          >
            <Input disabled={action === 'update'} placeholder="请输入IP地址" />
          </Form.Item>
          <Form.Item
            name="boxIP"
            label="魔盒IP"
            rules={[{ required: true, message: '请输需要绑定的魔盒IP' }]}
          >
            <Select
            // defaultValue={list[0]?.ip}
            // onChange={handleChange}
            >
              {(list || []).map(item => (
                <Select.Option key={item.ip} value={item.ip}>
                  {`${item.name}（${item.ip}）`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
}
