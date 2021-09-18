import React from "react";
import "@/assets/styles/public.less"
import {Radio} from "antd";
import {DictService} from "@/services/DictService";

interface DictRadioProps {
    dictName: string;
    onChange?;
    value?: string;
    className?: string;
    style?: object;
    defaultValue?: string;
    disabled?: boolean;
}

export class DictRadio extends React.Component<DictRadioProps> {
    dictService = new DictService();

    state = {
        dictOptions: []
    }

    componentDidMount() {
        if(this.props.dictName){
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

    }

    componentDidUpdate(prevProps: Readonly<DictRadioProps>, prevState: Readonly<{}>, snapshot?: any) {
        if (prevProps.dictName != this.props.dictName) {

        }
    }


    //渲染
    render() {
        const {value, style, className, defaultValue, disabled} = this.props;

        return <div>
            <Radio.Group className={className}
                         buttonStyle="solid"
                         disabled={disabled}
                         style={style}
                         onChange={this.props.onChange}
                         value={value}
                         defaultValue={defaultValue}
            >
                {
                    this.state.dictOptions.map(item => {
                        return <Radio.Button key={item.key} value={item.key}>{item.value}</Radio.Button>
                    })
                }
            </Radio.Group>
        </div>;
    }
}