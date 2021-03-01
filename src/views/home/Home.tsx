import {
  Badge,
  Button,
  Col,
  Collapse,
  Descriptions,
  Divider,
  Dropdown,
  Empty,
  Menu,
  message,
  Modal,
  Row,
  Space,
  Statistic,
  Timeline,
} from 'antd';
import {
  PlusOutlined,
  FieldTimeOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import React from 'react';
import styles from './home.module.less';
import { RouteComponentProps } from 'react-router-dom';
import { BoxEditorDrawer } from './components/box-editor-drawer';
import { CameraEditorDrawer } from './components/camera-editor-drawer';
import { ShootEditorDrawer } from './components/shoot-editor-drawer';
import downloadFile from '@src/utils/download-file';
import { api } from '@src/services/api';
import Login from './components/login-dialog';
import app from '@src/config/app';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SparkMD5 = require('spark-md5');

function mapStateToProps(state) {
  return state;
}
/**
 * 路由参数 Props 类型声明
 */
type RouterProps = RouteComponentProps<any>;

/**
 * 映射状态（从 store 中获取某些状态并传递给当前组件）类型声明
 */
type MapStateFromStoreProps = ReturnType<typeof mapStateToProps>;
/**
 * 组件派发 action 集合的类型声明
 */
// type ComponentDispatchProps = ReturnType<typeof mapDispatchToProps>;
/**
 * 组件最终接收的所有 Props 类型声明
 */
type HomeProps = RouterProps &
  MapStateFromStoreProps & {
    routes?: any;
  };

type HomeStatus = {
  boxAction: 'add' | 'delete' | 'update';
  boxActionText: string;
  boxDrawerVisible: boolean;
  cameraAction: 'add' | 'delete' | 'update';
  cameraActionText: string;
  cameraDrawerVisible: boolean;
  shootDrawerVisible: boolean;
  boxList: any[];
  shootList: any[];
  currentBox: any;
  currentCamera: any;
  isModalVisible: boolean;
  isLogin: boolean;
};

export default class Home extends React.Component<HomeProps, HomeStatus> {
  constructor(props) {
    super(props);
    this.state = {
      boxAction: 'add',
      boxActionText: '新增',
      boxDrawerVisible: false,
      cameraAction: 'add',
      cameraActionText: '新增',
      cameraDrawerVisible: false,
      shootDrawerVisible: false,
      boxList: null,
      shootList: null,
      currentBox: {},
      currentCamera: {},
      isModalVisible: false,
      isLogin: false,
    };
  }

  async componentDidMount() {
    const token = SparkMD5.hash(`${app.login.username}${app.login.password}`);
    if (token !== localStorage.getItem('token')) {
      this.setState({ isModalVisible: true, isLogin: false });
    } else {
      this.setState({ isLogin: true });
    }

    this.init();
  }

  init = async () => {
    const [boxRes, shootRes] = await Promise.all([
      api.home.getBoxCameraList(),
      api.home.getProcessList(),
    ]);
    this.setState({
      boxList: boxRes.data.boxList,
      shootList: shootRes.data,
    });
  };

  genExtra = boxItem => (
    <Dropdown.Button
      size="small"
      overlay={
        <Menu onClick={this.handleMenuClick}>
          <Menu.Item key="add">新增</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
          <Menu.Item key="update">修改</Menu.Item>
        </Menu>
      }
      onClick={this.handleBoxActionClick.bind(this, boxItem)}
    >
      {this.state.boxActionText}
    </Dropdown.Button>
  );

  handleMenuClick = e => {
    console.log(e);
    let text = '-';
    switch (e.key) {
      case 'add':
        text = '新增';
        break;
      case 'delete':
        text = '删除';
        break;
      case 'update':
        text = '修改';
        break;
      default:
        text = '新增';
        break;
    }
    this.setState({ boxAction: e.key, boxActionText: text });
  };

  handleBoxActionClick = async boxItem => {
    console.log(boxItem);
    const { boxAction } = this.state;
    if (boxAction === 'add' || boxAction === 'update') {
      this.setState({ boxDrawerVisible: true, currentBox: boxItem });
    } else {
      Modal.info({
        content: '确定要删除魔盒吗？',
        okText: '确定',
        onOk: async () => {
          try {
            await api.home.postBoxDelete({ ip: boxItem.ip });
            message.success('操作成功');
            this.init();
          } catch (error) {
            console.log(error);
          }
        },
      });
    }
  };

  genCameraExtra = (boxItem, cameraItem) => (
    <Dropdown.Button
      size="small"
      overlay={
        <Menu onClick={this.handleCameraMenuClick}>
          <Menu.Item key="add">新增</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
          <Menu.Item key="update">修改</Menu.Item>
        </Menu>
      }
      onClick={this.handleCameraActionClick.bind(this, boxItem, cameraItem)}
    >
      {this.state.cameraActionText}
    </Dropdown.Button>
  );

  handleCameraMenuClick = e => {
    console.log(e);
    let text = '-';
    switch (e.key) {
      case 'add':
        text = '新增';
        break;
      case 'delete':
        text = '删除';
        break;
      case 'update':
        text = '修改';
        break;
      default:
        text = '新增';
        break;
    }
    this.setState({ cameraAction: e.key, cameraActionText: text });
  };

  handleCameraActionClick = (boxItem, cameraItem) => {
    console.log(boxItem, cameraItem);
    const { cameraAction } = this.state;
    if (cameraAction === 'add' || cameraAction === 'update') {
      this.setState({
        cameraDrawerVisible: true,
        currentBox: boxItem,
        currentCamera: cameraItem,
      });
    } else {
      Modal.info({
        content: '确定要删除相机吗？',
        okText: '确定',
        onOk: async () => {
          try {
            await api.home.postCameraDelete({ ip: cameraItem.ip });
            message.success('操作成功');
            this.init();
          } catch (error) {
            console.log(error);
          }
        },
      });
    }
  };

  switchStatus = status => {
    let result = '';
    switch (status) {
      case 'online':
        result = 'processing';
        break;
      case 'offline':
        result = 'error';
        break;
      case 'connected':
        result = 'success';
        break;
      default:
        result = 'default';
        break;
    }
    return result as any;
  };

  getCameraList = () => {
    const { boxList } = this.state;

    if (!boxList) {
      return [];
    }

    const cameraList = [];
    boxList.map(item => {
      (item.cams || []).map(it => {
        cameraList.push({
          name: it.name,
          ip: it.ip,
        });
      });
    });
    console.log('getCameraList', cameraList);

    return cameraList;
  };

  onExportClick = () => {
    downloadFile(this.state.shootList);
  };

  onActionStartClick = async () => {
    try {
      await api.home.actionShoot();
      message.success('操作成功');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {
      boxDrawerVisible,
      boxList,
      shootList,
      currentBox,
      currentCamera,
      boxAction,
      cameraAction,
      cameraDrawerVisible,
      shootDrawerVisible,
      isModalVisible,
      isLogin,
    } = this.state;

    if (!isLogin) {
      return (
        <Login
          isModalVisible={isModalVisible}
          onClose={() => this.setState({ isModalVisible: false })}
          setLogin={() => this.setState({ isLogin: true })}
        />
      );
    }

    return (
      <section className={styles.container}>
        <Row justify="center">
          <Col span={14}>
            <Divider orientation="left">魔盒</Divider>
            {(boxList || []).length > 0 ? (
              <Collapse
                collapsible="header"
                defaultActiveKey={[boxList[0]?.ip]}
              >
                {boxList.map(boxItem => (
                  <Collapse.Panel
                    header={
                      <Space size="large">
                        <span>名称：{boxItem.name}</span>
                        <span>IP地址：{boxItem.ip}</span>
                        <span>相机数量：{(boxItem.cams || []).length}</span>
                        <span>
                          状态：
                          <Badge
                            status={this.switchStatus(boxItem.status)}
                            text={boxItem.status}
                          />
                        </span>
                      </Space>
                    }
                    key={boxItem.ip}
                    extra={this.genExtra(boxItem)}
                  >
                    {(boxItem?.cams || []).length > 0 ? (
                      (boxItem?.cams || []).map(cameraItem => (
                        <Descriptions
                          key={cameraItem.ip}
                          title={cameraItem.name}
                          extra={this.genCameraExtra(boxItem, cameraItem)}
                        >
                          <Descriptions.Item label="IP地址">
                            {cameraItem.ip}
                          </Descriptions.Item>
                          <Descriptions.Item label="状态">
                            <Badge
                              status={this.switchStatus(cameraItem.status)}
                              text={cameraItem.status}
                            />
                          </Descriptions.Item>
                        </Descriptions>
                      ))
                    ) : (
                      <Empty>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            this.setState({
                              cameraDrawerVisible: true,
                              currentBox: boxItem,
                              currentCamera: null,
                            });
                          }}
                        >
                          立即添加相机
                        </Button>
                      </Empty>
                    )}
                  </Collapse.Panel>
                ))}
              </Collapse>
            ) : (
              <Empty>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    this.setState({ boxDrawerVisible: true, currentBox: null });
                  }}
                >
                  立即添加魔盒
                </Button>
              </Empty>
            )}

            <Divider orientation="left" style={{ marginTop: 50 }}>
              拍摄流
            </Divider>
            {(shootList?.cams || []).length > 0 ? (
              <Collapse
                collapsible="header"
                defaultActiveKey={[shootList?.cams[0]?.ip]}
              >
                {(shootList?.cams || []).map(shootItem => (
                  <Collapse.Panel
                    header={
                      <Space size="large">
                        <span>名称：{shootItem.name}</span>
                        <span>IP地址：{shootItem.ip}</span>
                      </Space>
                    }
                    key={shootItem.ip}
                    extra={
                      <Space>
                        <Button
                          type="link"
                          size="small"
                          onClick={() =>
                            this.setState({ shootDrawerVisible: true })
                          }
                        >
                          修改
                        </Button>
                        <Button
                          type="link"
                          size="small"
                          onClick={this.onExportClick}
                        >
                          导出
                        </Button>
                      </Space>
                    }
                  >
                    <Timeline>
                      {(shootItem?.shootSlice || []).map(sliceItem => (
                        <Timeline.Item
                          key={Math.random()}
                          color={sliceItem.type === 'wait' ? 'red' : 'green'}
                        >
                          <Statistic
                            title={
                              sliceItem.type === 'wait'
                                ? '等待（s）'
                                : '拍摄（s）'
                            }
                            prefix={<FieldTimeOutlined />}
                            valueStyle={{ fontSize: 20 }}
                            value={sliceItem.time}
                          />
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </Collapse.Panel>
                ))}
              </Collapse>
            ) : (
              <Empty>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => this.setState({ shootDrawerVisible: true })}
                >
                  立即添加拍摄流
                </Button>
              </Empty>
            )}
            <Button
              type="primary"
              onClick={this.onActionStartClick}
              block
              size="large"
              icon={<PoweroffOutlined></PoweroffOutlined>}
              style={{ marginTop: 60 }}
            >
              开始拍摄
            </Button>
          </Col>
        </Row>

        <BoxEditorDrawer
          visible={boxDrawerVisible}
          item={currentBox}
          action={boxAction}
          onClose={() => this.setState({ boxDrawerVisible: false })}
          onFinish={this.init}
        />

        <CameraEditorDrawer
          visible={cameraDrawerVisible}
          item={currentCamera}
          boxItem={currentBox}
          list={boxList}
          action={cameraAction}
          onClose={() => this.setState({ cameraDrawerVisible: false })}
          onFinish={this.init}
        />

        <ShootEditorDrawer
          visible={shootDrawerVisible}
          list={shootList}
          cameraList={this.getCameraList()}
          onClose={() => this.setState({ shootDrawerVisible: false })}
          onFinish={this.init}
        />
      </section>
    );
  }
}
