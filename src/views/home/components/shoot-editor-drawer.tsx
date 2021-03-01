import React from 'react';
import {
  Button,
  Divider,
  Drawer,
  Form,
  FormInstance,
  InputNumber,
  message,
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
import { api } from '@src/services/api';

type ShootEditorDrawerProps = {
  visible: boolean;
  list: any;
  cameraList: {
    name: string;
    ip: string;
  }[];
  onClose: () => any;
  onFinish: () => any;
};

type ShootEditorDrawerStatus = {
  submitLoading: boolean;
};

export class ShootEditorDrawer extends React.Component<
  ShootEditorDrawerProps,
  ShootEditorDrawerStatus
> {
  constructor(props) {
    super(props);
    this.state = {
      submitLoading: false,
    };
  }

  formRef = React.createRef() as React.RefObject<FormInstance<any>>;

  componentDidUpdate() {
    const { list } = this.props;
    if (!this.formRef.current) {
      return;
    }
    this.formRef.current.setFieldsValue({
      ...list,
      repateTime: list.repateTime ? parseInt(list.repateTime) : null,
    });
  }

  onFinish = async () => {
    const { onClose, onFinish } = this.props;
    console.log('finish');
    const value = this.formRef.current.getFieldsValue();
    const params = {
      cams: value.cams.map(item => {
        let name = '-';
        this.props.cameraList.map(it => {
          if (it.ip === item.ip) {
            name = it.name;
          }
        });
        const shootSlice = [];
        (item.shootSlice || []).map(i => {
          shootSlice.push({
            ...i,
            time: i.time + '',
          });
        });
        return {
          ...item,
          name,
          shootSlice,
        };
      }),
      repateTime: value.repateTime + '',
    };
    console.log(params);
    this.setState({ submitLoading: true });
    try {
      await api.home.postProcessAdd(params);
      message.success('操作成功');
      onFinish();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ submitLoading: false });
    }
  };

  beforeUpload = file => {
    console.log('file', file);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      that.formRef.current.setFieldsValue(
        JSON.parse(
          decodeURIComponent(atob((this.result as string).split(',')[1])),
        ),
      );
    };
    return true;
  };

  render() {
    const { visible, onClose, cameraList } = this.props;
    const { submitLoading } = this.state;

    return (
      <Drawer
        title="新增/修改拍摄流"
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
              loading={submitLoading}
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

          <Form.Item
            name="repateTime"
            label="重拍等待时长"
            rules={[{ required: true, message: '请输入重拍等待时长' }]}
          >
            <InputNumber min={0} precision={0} />
          </Form.Item>

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
