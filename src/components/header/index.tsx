import * as React from 'react'
import './style.less'
import {Header} from "antd/es/layout/layout";
import logo from "@/assets/images/logo.png"
import {Avatar, Button, message, Popover} from "antd";
import {UserInfo} from "@/actions/LoginAction";
import SlideMenu from "./SlideMenu";
import history from "@/utils/history";
import {UserOutlined} from "@ant-design/icons";
import {checkToken, removeToken} from "@/utils/request";
import {LoginService} from "@/services/LoginService";

interface TopHeaderProps {
    userInfo?: UserInfo;
}

export default class TopHeader extends React.Component<TopHeaderProps> {
    constructor(props: TopHeaderProps) {
        super(props);
        this.state = {};
    }

    loginService = new LoginService();

    componentDidMount() {
        if (!checkToken()){
            history.push('/login');
        }
    }

    handleLogin = () => {
        history.push('/login');
    };
    handleLogout = () => {
        this.loginService.logout((res)=>{
            if(res.code === 100){
                removeToken();
                localStorage.removeItem("userInfo");
                history.push('/login');
            }
        },error => {
            message.error(error);
        })

    };

    public render() {
        const {userName, userImage} = this.props.userInfo
        const isLogin = userName != undefined && userName != null && userName != "" ? true : false;
        return <Header id="sso-header" style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className={"logo"}>
                <img className={"logo-image"} src={logo}/>
                <div><p className={"logo-title-p"}>REACT DEMO</p></div>
            </div>
            <div className={"user-operate-center"}>
                {
                    isLogin ? <Popover placement="bottom"
                                       content={<SlideMenu userName={userName}
                                                           logout={this.handleLogout}/>} trigger="click">
                        <Avatar icon={<UserOutlined/>} src={userImage} style={{cursor: 'pointer'}}/>
                        <div style={{
                            display: "inline-block",
                            paddingLeft: 10,
                            color: "#fff",
                            cursor: "pointer"
                        }}>{userName.length > 8 ? userName.substring(0, 6) + "..." : userName}</div>
                    </Popover> : <div>
                        <Button style={{color: "#fff"}} type="link" onClick={this.handleLogin}>登录</Button>
                    </div>
                }
            </div>
        </Header>
    }
}
