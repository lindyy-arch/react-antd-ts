import React from "react";
import {connect} from "react-redux";
import {Tabs} from "antd";

const {TabPane} = Tabs;


interface WorkSpaceProps {
    userInfo: () => void
}

class InnerWorkSpace extends React.Component<WorkSpaceProps> {

    //初始化
    componentDidMount() {
        //当前用户信息
        const {userInfo} = this.props;
    }

    render() {
        return <div className={"menu-item-page"}>
            <div className="common-div-body">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="输入字段" key="1">

                    </TabPane>
                    <TabPane tab="输出字段" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="组件资源" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                    <TabPane tab="规则包维护" key="4">
                        Content of Tab Pane 4
                    </TabPane>
                    <TabPane tab="在线资源" key="5">
                        Content of Tab Pane 5
                    </TabPane>
                </Tabs>
            </div>

        </div>;
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginState.userInfo
})
export const WorkSpaceManage = connect(mapStateToProps)(InnerWorkSpace);
