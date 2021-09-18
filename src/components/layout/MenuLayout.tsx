import React from "react";
import {Breadcrumb, Layout, Menu} from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import {Link} from "react-router-dom";
import {MenuService} from "@/services/MenuService";
import * as Icon from '@ant-design/icons';
import { renderRoutes } from 'react-router-config';
import routes from "@/router";
const { Content, Sider} = Layout;
import "@/assets/styles/public.less"
import history from '../../utils/history';
import {NewBreadcrumb} from "@/components/public/breadcrumb/NewBreadcrumb";
export class MenuLayout extends React.Component<any, any>{
    menuService = new MenuService();
    state = {
        menus : <div/>,
        defaultOpenKeys: [],
    }

    componentDidMount() {
        this.menuService.buildMenu(res => {
            if(res.code === 100){
                this.setState({
                    menus: this.getMenuList(res.data),
                    defaultOpenKeys: this.getRootMenuKeys(res.data)
                });
                this.forceUpdate()
            }
        }, res => {

        });
    }

    getMenuList = (menuList) => {
        return menuList.map(item => {
            if(!item.children){
                let icon = <div/>;
                if (item.icon) {
                    icon = React.createElement(
                        Icon[item.icon],
                        {
                            style:{ fontSize: '20px'}
                        }
                    )
                }
                return (
                    //渲染
                    <Menu.Item key={item.path} icon={icon}>
                        <Link to={item.path}>
                            {item.title}
                        </Link>
                    </Menu.Item>
                )
            } else {
                let icon = <div/>;
                if (item.icon) {
                    icon = React.createElement(
                        Icon[item.icon],
                        {
                            style:{ fontSize: '20px'}
                        }
                    )
                }
                return (
                    <SubMenu key={item.path} title={item.title} icon={icon}>
                        {
                            this.getMenuList(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    };

    getRootMenuKeys = (menuList) => {
        const openKeys = [];
        menuList.map(item => {
            openKeys.push(item.path);
        });
        return openKeys;
    }

    render() {
        return <Layout style={{marginTop: 50}}>
            <Sider className={"sider"} width={200}
            >
                <Menu
                    mode="inline"
                    style={{ height: '100%', borderRight: 0 }}
                >
                    {this.state.menus}
                </Menu>
            </Sider>
            <Layout style={{marginLeft: 200}}>

                <Content style={{
                    minHeight: document.documentElement.clientHeight-75}}>
                    {/*<div className="breadcrumb-div-body">*/}
                    {/*    <NewBreadcrumb pathName={history.location.pathname}></NewBreadcrumb>*/}
                    {/*</div>*/}
                    {renderRoutes(routes)}
                </Content>
            </Layout>
        </Layout>;
    }
}