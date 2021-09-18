import * as React from 'react'
import TopHeader from "../header";
import Footer from "../footer";
import {Layout, BackTop} from "antd";
import {connect} from "react-redux";
import history from '../../utils/history';

class InnerHome extends React.Component<any>{

    componentDidMount() {
        const {userInfo} = this.props;
        if (localStorage.getItem("userInfo") == ""){
            history.push("/login");
        }
        console.log("userInfo", userInfo);
    }

    render() {
        return <div>
            <Layout>
                <BackTop />
                <TopHeader userInfo={this.props.userInfo}/>
                {this.props.children}
                <Footer/>
            </Layout>
        </div>
    }
}


const mapStateToProps = (state) => ({
    userInfo: state.loginState.userInfo
})
export const Home = connect(mapStateToProps)(InnerHome);

