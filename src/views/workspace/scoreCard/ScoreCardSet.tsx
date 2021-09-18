import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Card, Col, Form, FormInstance, Input, Popconfirm, Row, Space, Table} from "antd";
import {AddScoreModal} from "@/views/workspace/scoreCard/AddScoreModal";
import {connect} from "react-redux";
import {DownloadOutlined} from "@ant-design/icons";

class InnerScoreCardSet extends React.Component {

    state = {
        visible: false,
        modalLoading: false,
        isAddModalShow: false,
        addModalKey: "",
        columns: [
            {
                title: '字段名称',
                dataIndex: 'fieldEn',
                width: 200,
                render(text, record) {
                    return {
                        children: record.fieldEn,
                        props: {
                            rowSpan: record.rowSpan,
                        }
                    }
                }
            },
            {
                title: '中文名',
                dataIndex: 'fieldCn',
                width: 200,
                render(text, record) {
                    return {
                        children: record.fieldCn,
                        props: {
                            rowSpan: record.rowSpan,
                        }
                    }
                }
            },
            {
                title: '分段',
                dataIndex: 'segment',
                width: 200,

            },
            {
                title: '分值',
                dataIndex: 'score',
                editable: true,
                width: 200,

            },
            {
                title: '操作',
                dataIndex: 'operation',
                width: 200,
                render(text, record) {
                    return {
                        children: <Space size="middle">
                            <Popconfirm
                                placement="topRight"
                                title="确定删除该字段级所有分段评分?"
                                onConfirm={() => {
                                    this.handleDelete(record);
                                }}
                                okText="确定"
                                cancelText="取消"
                            >
                                <a>删除</a>
                            </Popconfirm>
                        </Space>,
                        props: {
                            rowSpan: record.rowSpan,
                        }
                    }
                }
            },
        ],
        dataSource: [
            {
                fieldEn: 'testField',
                fieldCn: '公积金',
                segment: '0-10',
                score: 20,
            },
            {
                fieldEn: 'testField',
                fieldCn: '公积金',
                segment: '11-50',
                score: 30,
            },
            {
                fieldEn: 'testField',
                fieldCn: '公积金',
                segment: '51-100',
                score: 50,
            },
            {
                fieldEn: 'test',
                fieldCn: '啊啊啊啊',
                segment: '0-100',
                score: 50,
            },
        ],
    }
    handleDelete = (record) => {

    }

    handleSave = (record) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => record.key === item.fieldEn);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...record,
        });
        this.setState({dataSource: newData});
    };

    //合并数组单元格
    createNewArr = (data) => {
        return data.reduce((result, item) => {
            //首先将name字段作为新数组result取出
            if (result.indexOf(item.fieldEn) < 0) {
                result.push(item.fieldEn)
            }
            return result
        }, []).reduce((result, name) => {
            //将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
            const children = data.filter(item => item.fieldEn === name);
            result = result.concat(
                children.map((item, index) => ({
                    ...item,
                    rowSpan: index === 0 ? children.length : 0,//将第一行数据添加rowSpan字段
                }))
            )
            return result;
        }, [])
    }
    addSaveHandle = (values) => {
        let dataSource = this.state.dataSource.concat(values);
        this.setState({dataSource})
        this.setState({isAddModalShow: false, modalLoading: false});
    }
    addCancelHandle = () => {
        this.setState({isAddModalShow: false, modalLoading: false});
    }

    addFieldScore = () => {
        this.setState({
            isAddModalShow: true,
            addModalKey: "addModalKey" + new Date().getTime().toString()
        })
    }

    render() {

        const {isAddModalShow, modalLoading, addModalKey, columns, dataSource} = this.state;
        return <div className={"menu-item-page"}>
            <div className="common-div-body">
                <Card title={<div style={{fontWeight: 500}}>评分卡</div>}>
                    <Button type="primary" onClick={this.addFieldScore} style={{marginBottom: 16}}>新增字段</Button>
                    <Button type="primary" onClick={this.addFieldScore} style={{marginBottom: 16, marginLeft: 8}}>导入评分卡</Button>
                    <Button type="link" icon={<DownloadOutlined/>}>模板下载</Button>
                    <Row gutter={24}>
                        <Col span={16}>
                            <Table
                                rowClassName={() => 'editable-row'}
                                bordered
                                dataSource={this.createNewArr(dataSource)}
                                columns={columns}
                            />
                        </Col>
                        <Col>

                        </Col>
                    </Row>
                </Card>
                <AddScoreModal key={addModalKey}
                               loading={modalLoading}
                               visible={isAddModalShow}
                               handleOk={this.addSaveHandle}
                               handleCancel={this.addCancelHandle}>
                </AddScoreModal>
            </div>
        </div>;
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.loginState.userInfo
})
export const ScoreCardSet = connect(mapStateToProps)(InnerScoreCardSet);