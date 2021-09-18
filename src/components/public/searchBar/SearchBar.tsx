import React from "react";
import "@/assets/styles/public.less"
import {Button, Col, Form, FormInstance, Row} from "antd";

interface searchBarProps {
    //查询列的数量
    columnSize: number;
    //点击查询回调
    onFinish: (values: any) => void;
    //提供父组件引用
    onRef?: (object) =>void
    //初始化化数据
    initialValues?: object
}

export class SearchBar extends React.Component<searchBarProps>{
    //表单实例的引用
    formRef = React.createRef<FormInstance>();

    //React生命周期初始化函数
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    //重置
    handleReset = () => {
        this.formRef.current.resetFields();
    };


    //渲染
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };

        //获取props参数
        const {columnSize,initialValues} = this.props;
        return <div className="search-bar-content" style={{height: 85 + (parseInt(String(columnSize/4)) + 1) * 56}}>
            <Form {...formItemLayout}
                  className="ant-advanced-search-form"
                  ref={this.formRef}
                  onFinish={this.props.onFinish}
                  initialValues={initialValues}
            >
                {this.props.children}
                <Row>
                    <Col span={24} style={{ textAlign: 'right',paddingRight: 5 }}>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>;
    }
}