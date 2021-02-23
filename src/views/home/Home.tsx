import { Button } from 'antd';
import React from 'react';
// import { renderAllRoutes } from '@routes/route-loader';
import { RouteComponentProps } from 'react-router-dom';

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

export default class Home extends React.Component<HomeProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
        <Button>Default Button</Button>
      </section>
    );
  }
}
