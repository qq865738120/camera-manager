import React from 'react';
import { Button, Form, FormInstance, InputNumber, Select, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { FormListFieldData } from 'antd/lib/form/FormList';

type ShootActionFormProps = {
  index?: number;
  form?: FormInstance<any>;
  field: FormListFieldData;
};

type ShootActionFormStatus = {
  // cameraList: {
  //   name: string;
  //   ip: string;
  // }[];
};

export class ShootActionForm extends React.Component<
  ShootActionFormProps,
  ShootActionFormStatus
> {
  constructor(props) {
    super(props);
  }

  render() {
    const { field } = this.props;

    return (
      <Form.Item name={[field.name, 'shootSlice']}>
        <Form.List
          name={[field.name, 'shootSlice']}
          rules={[
            {
              validator: async (_, shootSlice) => {
                if (!shootSlice || shootSlice.length < 1) {
                  return Promise.reject(new Error('至少添加一个操作'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(innerField => (
                <section key={innerField.key}>
                  <Space align="baseline">
                    <Form.Item
                      {...innerField}
                      name={[innerField.name, 'type']}
                      fieldKey={[innerField.fieldKey, 'type']}
                      label="操作类型"
                      rules={[
                        {
                          required: true,
                          message: '请输入',
                        },
                      ]}
                    >
                      <Select style={{ width: 100 }}>
                        {[
                          { label: '拍摄', value: 'shoot' },
                          { label: '等待', value: 'wait' },
                        ].map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            {`${item.label}`}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...innerField}
                      name={[innerField.name, 'time']}
                      fieldKey={[innerField.fieldKey, 'time']}
                      label="时长"
                      rules={[
                        {
                          required: true,
                          message: '请输入',
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        precision={0}
                        style={{ width: 110 }}
                      />
                    </Form.Item>

                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        onClick={() => remove(innerField.name)}
                      />
                    ) : null}
                  </Space>
                </section>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: 355 }}
                  icon={<PlusOutlined />}
                >
                  添加操作
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    );
  }
}
