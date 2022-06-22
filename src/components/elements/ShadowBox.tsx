import { PureComponent } from 'react';

interface IProps {
}

class ShadowBox extends PureComponent<IProps> {
    render() {
        return (
            <div className="box-with-shadow" style={{ margin: '10px 0px', padding: "20px" }}>
                {this.props.children}
            </div>
        );
    }
}

export default ShadowBox;
