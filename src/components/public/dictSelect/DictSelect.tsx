import React from "react";
import "@/assets/styles/public.less"
import {Select} from "antd";
import {DictService} from "@/services/DictService";

const {Option} = Select;

interface DictSelectProps {
    dictName: string;
    onChange?;
    value?: string;
    className?: string;
    style?: object;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
}

export class DictSelect extends React.Component<DictSelectProps> {
    dictService = new DictService();

    state = {
        dictOptions: []
    }

    componentDidMount() {
        this.dictService.qryDictByNames(this.props.dictName, (res) => {
            if (res.code === 100) {
                let dictOptions = [];
                const dictMap = res.data
                for (let key in dictMap) {
                    if (key == this.props.dictName) {
                        dictOptions = dictMap[key]
                    }
                    this.setState({dictOptions});
                }
            }
        }, (error) => {

        })
    }


    //渲染
    render() {
        const {value, style, className, defaultValue, placeholder, disabled} = this.props;

        return <div>
            <Select className={className} disabled={disabled}
                    style={style}
                    onChange={this.props.onChange}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
            >
                {
                    this.state.dictOptions.map(item => {
                        return <Option key={item.key} value={item.key}>{item.value}</Option>
                    })
                }
            </Select>
        </div>;
    }
}