import React from "react";
import {Menu} from "antd";
import {EditOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import history from '../../utils/history';

interface SlideMenuProps {
    userName: string;
    logout: () => void;
}
export default class SlideMenu extends React.Component<SlideMenuProps>{
    state = {
        menuData:[
            {
                iconType: <UserOutlined />,
                text:'我的主页',
                linkPath:'/admin/user'
            },
            {
                iconType: <EditOutlined />,
                text:'修改密码',
                linkPath:'/admin/user/settings/profile'
            },
            {
                iconType: <LogoutOutlined />,
                text:'登出',
                linkPath:'/admin/logout'
            }
        ]
    };
    handleClick=(e)=>{
        if (e.keyPath[0] === '/sso/logout') {
            this.props.logout();
        } else {
            history.push(e.keyPath[0]);
        }
    }
    render() {
        const SubMenu = Menu.SubMenu;
        return (
            <div>
                <Menu onClick={this.handleClick.bind(this)} style={{ width: 130,border:'none' }} mode="vertical">
                    {
                        this.state.menuData.map((item,index)=>{
                            return <Menu.Item key={item.linkPath}>
                                    {item.iconType}
                                    {item.text}
                                </Menu.Item>
                        })
                    }
                </Menu>
            </div>
        );
    }
}



