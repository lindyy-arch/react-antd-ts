import './style.less';
import { HashRouter , Route, Redirect, Switch} from 'react-router-dom';
import React from "react";
import {Login} from "../login/Login";
import {Home} from "../home/Home";
import {MenuLayout} from "@/components/layout/MenuLayout";
import {BaseLayout} from "@/components/layout/BaseLayout";
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";

export default class App extends React.Component {

    render() {
        return (
            <div className="App">
                <ConfigProvider locale={zhCN}>
                    <HashRouter>
                        <Switch>
                            <Route path={"/login"} component={Login}></Route>
                            <Route exact path='/' render={()=> (
                                <Redirect path='/' to={"/admin"}/>
                            )}/>
                            <Home>
                                <Route path={"/admin"} component={MenuLayout}></Route>
                                <Route path={"/base"} component={BaseLayout}></Route>
                            </Home>
                        </Switch>
                    </HashRouter>
                </ConfigProvider>
            </div>
        );
    }
}
