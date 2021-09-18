import React from "react";
import {BackTop, Layout} from "antd";
import TopHeader from "@/components/header";
import Footer from "@/components/footer";
import {BaseLayout} from "@/components/layout/BaseLayout";
import {connect} from "react-redux";

class InnerUserCenter extends React.Component<any>{

    componentDidMount() {
        const {userInfo} = this.props;
        console.log("userInfo", userInfo);
    }
    render() {
        return <div>
                aaaaaaaaaaaaaaaa
        </div>;
    }
}
const mapStateToProps = (state) => ({
    userInfo: state.loginState.userInfo
})
export const UserCenter = connect(mapStateToProps)(InnerUserCenter);
