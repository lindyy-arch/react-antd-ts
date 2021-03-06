import * as React from 'react'
import './style.less'

interface HelloProps {
    value?: string;
}

interface HelloStatus {
    value?: string;
}
export default class Footer extends React.Component<HelloProps, HelloStatus> {
    constructor(props: HelloProps) {
        super(props);
        this.state = {
            value: props.value,
        };
    }

    public render() {
        return <div className='footer'>
            <span>{'二十六度数字科技（广州）有限公司 © 2020-2021'}</span>
        </div>
    }
}