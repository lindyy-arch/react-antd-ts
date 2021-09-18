import React from "react";
import {Layout} from "antd";
import {Route, Switch} from "react-router-dom";
import {UserCenter} from "@/views/system/userCenter";
const { Content } = Layout;

export class BaseLayout extends React.Component<any, any>{

    render() {
        return <div>
            <Layout>
                <Content style={{background: '#FFF'}}>
                    <Switch>
                        <Route path='/user' component={UserCenter}/>
                    </Switch>
                </Content>
            </Layout>
        </div>;
    }
}