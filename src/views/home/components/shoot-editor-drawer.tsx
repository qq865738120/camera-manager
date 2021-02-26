import React from 'react';
import {
  Button,
  Divider,
  Drawer,
  Form,
  FormInstance,
  Select,
  Space,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { ShootActionForm } from './shoot-action-form';

type ShootEditorDrawerProps = {
  visible: boolean;
  list: any;
  cameraList: {
    name: string;
    ip: string;
  }[];
  onClose: () => any;
};

type ShootEditorDrawerStatus = {
  // cameraList: {
  //   name: string;
  //   ip: string;
  // }[];
};

export class ShootEditorDrawer extends React.Component<
  ShootEditorDrawerProps,
  ShootEditorDrawerStatus
> {
  constructor(props) {
    super(props);
  }

  formRef = React.createRef() as React.RefObject<FormInstance<any>>;

  componentDidUpdate() {
    // const { boxList } = this.props;
    // if (!this.formRef.current) {
    //   return;
    // }
    // this.formRef.current.setFieldsValue({
    //   name: item.name,
    //   ip: item.ip,
    //   boxIP: boxItem.ip,
    // });
  }

  onFinish = async () => {
    const { onClose } = this.props;
    console.log('finish');
    const value = this.formRef.current.getFieldsValue();
    console.log(value);
    onClose();
  };

  beforeUpload = file => {
    console.log('file', file);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      that.formRef.current.setFieldsValue({
        cams: JSON.parse(
          decodeURIComponent(atob((this.result as string).split(',')[1])),
        ),
      });
    };
    return true;
  };

  render() {
    const { visible, onClose, cameraList } = this.props;

    return (
      <Drawer
        title="修改拍摄流"
        width={500}
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
          name="shoot-form"
          ref={this.formRef}
          // initialValues={action === 'update' ? item : { boxIP: boxItem?.ip }}
          onFinish={this.onFinish}
        >
          <Form.List
            name="cams"
            rules={[
              {
                validator: async (_, cams) => {
                  if (!cams || cams.length < 1) {
                    return Promise.reject(new Error('至少添加一个相机'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(field => (
                  <section key={field.key}>
                    <Space align="baseline">
                      <Form.Item
                        {...field}
                        name={[field.name, 'ip']}
                        label="相机"
                        rules={[
                          {
                            required: true,
                            message: '请输入',
                          },
                        ]}
                      >
                        <Select style={{ width: 300 }}>
                          {(cameraList || []).map(item => (
                            <Select.Option key={item.ip} value={item.ip}>
                              {`${item.name}（${item.ip}）`}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Space>

                    <ShootActionForm field={field} />

                    <Divider dashed />
                  </section>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    添加相机
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item label="导入配置">
            <Upload beforeUpload={this.beforeUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>点击导入</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
}
