import React from "react";
import {Button, Col, Form, FormInstance, Input, message, Modal, Row, Switch, Tree} from "antd";
import {CarryOutOutlined} from "@ant-design/icons";
import {OfficeService} from "@/services/OfficeService";

interface OfficeTreeModalProps {
    visible: boolean,
    handleOk: (values) => void,
    handleCancel: () => void
}

export class OfficeTreeModal extends React.Component<OfficeTreeModalProps> {
    officeService = new OfficeService();

    state = {
        officeTreeData: [],
        expandedKeys: [],
        selectedNode: {},
    }

    componentDidMount() {
        this.officeService.buildOfficeTree((res) => {
            if (res.code === 100) {
                const officeTreeData = res.data.officeTree;
                const expandedKeys = [];
                let loop = (data) => {
                    data.map((item) => {
                        expandedKeys.push(item.key);
                        if (item.children && item.children.length > 0) {
                            loop(item.children)
                        }
                    })
                }
                loop(officeTreeData);
                this.setState({officeTreeData, expandedKeys})
            }
        }, (error) => {
            message.error(error);
        })
    }

    handleSave = () => {
        this.props.handleOk(this.state.selectedNode);
    }
    handleCancel = () => {
        this.props.handleCancel();
    }

    searchOfficeClick = () => {
        this.setState({isShowOfficeModal: true});

    }

    onSelect = (selectedKeys, e) => {
        this.setState({selectedNode: {key: e.node.key, title: e.node.title}})
    }

    render() {
        const {officeTreeData, expandedKeys} = this.state;
        const {visible} = this.props;
        return (
            <Modal
                visible={visible}
                title="选择机构"
                onOk={this.handleSave}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleSave}>
                        确认
                    </Button>,
                ]}
            >
                <Tree
                    autoExpandParent={true}
                    expandedKeys={expandedKeys}
                    onSelect={this.onSelect}
                    treeData={officeTreeData}
                />
            </Modal>
        );
    }
}