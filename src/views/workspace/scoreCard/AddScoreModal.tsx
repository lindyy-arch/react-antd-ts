import React from "react";
import {Button, Col, Form, FormInstance, Input, Modal, Row, Select, Spin, TreeSelect} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";

const {Option} = Select;

interface AddScoreModalProps {
    loading: boolean,
    visible: boolean,
    handleOk: (values) => void,
    handleCancel: () => void
}

export class AddScoreModal extends React.Component<AddScoreModalProps> {
    state = {
        fieldEn: null,
        fieldCn: null,
        fieldScoreList: [{fieldEn: "", fieldCn: "", segment: "", score: null}]
    }

    formRef = React.createRef<FormInstance>();

    fieldChange = (value, e) => {
        console.log(e);
        this.setState({
            fieldEn: value,
            fieldCn: e.children
        })
    }

    handleSave = () => {
        const {getFieldValue} = this.formRef.current;

        this.formRef.current.validateFields().then(values => {
            const fieldScoreList = []
            let {fieldEn, fieldCn} = this.state;
            let number = this.state.fieldScoreList.length;
            for (let i = 0; i < number; i++) {
                let segment = getFieldValue(`segment${i}`);
                let score = getFieldValue(`score${i}`);
                fieldScoreList.push({fieldEn, fieldCn, segment, score});
            }
            console.log(fieldScoreList)
            this.props.handleOk(fieldScoreList);
        }).catch(errorInfo => {
            console.log(errorInfo);
        });
    }
    handleCancel = () => {
        this.formRef.current.resetFields();
        this.props.handleCancel();
    }
    collectFiledScore = () => {
        const {getFieldValue} = this.formRef.current;
        const fieldScoreList = [];
        let number = this.state.fieldScoreList.length;
        for (let i = 0; i < number; i++) {
            let fieldEn = this.state.fieldEn;
            let segment = getFieldValue(`segment${i}`);
            let score = getFieldValue(`score${i}`);
            fieldScoreList.push({fieldEn, segment, score});
        }
        return fieldScoreList;
    }
    addFieldScore = () => {
        let fieldScoreList = this.collectFiledScore();
        fieldScoreList.push({fieldEn: "", segment: "", score: ""});
        this.setState({fieldScoreList});
    }
    delFieldScore = (index) => {
        const {resetFields} = this.formRef.current;
        resetFields([`segment${index}`, `score${index}`]);
        let fieldScoreList = this.collectFiledScore();
        //????????????index?????????
        fieldScoreList.splice(index, 1);
        this.setState({fieldScoreList});
    }

    validateScore = (index, rule, value, callback) => {
        if (!value) {
            callback();
        }
        const {getFieldValue} = this.formRef.current;
        let segment = getFieldValue(`segment${index}`);
        if (segment) {
            const arr = segment.split(/[()\]\[,]/).filter(i => i && i.trim());
            let firstChar = segment.charAt(0);
            let endChar = segment.charAt(segment.length - 1);
            let message = "?????????????????????";
            let firstElement = Number(arr[0]);
            let endElement = Number(arr[1]);
            let current = Number(value);
            if (firstChar === '(' && endChar === ')') {
                if (current <= firstElement || current >= endElement) {
                    message = message + "??????" + firstElement + ",??????" + endElement;
                }
            } else if (firstChar === '(' && endChar === ']') {
                if (current <= firstElement || current > endElement) {
                    message = message + "??????" + firstElement + ",????????????" + endElement;
                }
            } else if (firstChar === '[' && endChar === ')') {
                if (current < firstElement || current >= endElement) {
                    message = message + "????????????" + firstElement + ",??????" + endElement;
                }
            } else if (firstChar === '[' && endChar === ']') {
                if (current < firstElement || current > endElement) {
                    message = message + "????????????" + firstElement + ",????????????" + endElement;
                }
            }
            if (message !== "?????????????????????") {
                callback(message);
            }
        }
        callback();
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const {visible, loading} = this.props;
        const {fieldScoreList, fieldEn} = this.state;
        let number = fieldScoreList.length;
        let fieldScoreComps = fieldScoreList.map((el, index) => {
            return (
                <span key={index}>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item hidden={index != 0}
                                       name={`filedEn`}
                                       label={`??????:`}
                                       rules={[{
                                           required: index == 0,
                                           message: '???????????????'
                                       }]}
                            >
                                <Select onChange={this.fieldChange} placeholder={"???????????????"}>
                                    <Option value="income">?????????</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        {
                            fieldEn ?
                                <>
                                    <Col span={6}>
                                        <Form.Item
                                            name={`segment${index}`}
                                            label="????????????"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "??????????????????"
                                                },
                                                {
                                                    pattern: new RegExp('^(\\[|\\()[0-9]{0}([0-9]|[.])+[,]{1}[0-9]{0}([0-9]|[.])+(\\]|\\))$'),
                                                    message: "?????????????????????????????????,?????????(0,1)???[0,1]???(0,1]???[0,1)"
                                                }
                                            ]}
                                        >
                                            <Input placeholder={"??????????????????"}></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            name={`score${index}`}
                                            label="?????????"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "???????????????"
                                                },
                                                {
                                                    pattern: new RegExp('^(\\-|\\+)?\\d+(\\.\\d+)?$'),
                                                    message: "???????????????????????????"
                                                },
                                                {
                                                    validator: ((rule, value, callback) => {
                                                        this.validateScore(index, rule, value, callback)
                                                    })
                                                }
                                            ]}
                                        >
                                            <Input placeholder={"???????????????"}></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} style={{marginTop: 6}}>
                                        {index === number - 1 && number < 10 &&
                                        <Button shape="circle" size="small" icon={<PlusOutlined/>} type="primary"
                                                style={{marginRight: 10}}
                                                onClick={this.addFieldScore}/>}
                                        {((number > 1 && index === 0) || index > 0) &&
                                        <Button shape="circle" size="small" icon={<MinusOutlined/>} type="default"
                                                onClick={() => {
                                                    this.delFieldScore(index)
                                                }}/>}
                                    </Col>
                                </> : null
                        }

                   </Row>
                </span>
            )
        });

        return <div>
            <Modal
                visible={visible}
                title={"????????????"}
                onOk={this.handleSave}
                onCancel={this.handleCancel}
                width={1200}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>
                        ??????
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={this.handleSave}>
                        ??????
                    </Button>,
                ]}
            >
                <Spin spinning={loading}>
                    <Form {...formItemLayout}
                          className={"base-form-body"}
                          ref={this.formRef}
                    >
                        {fieldScoreComps}
                    </Form>
                </Spin>

            </Modal>
        </div>;
    }
}