import { PureComponent } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';

interface IProps {
  onMenuClick: any;
  menuOptions?: any[];
  buttonStyle?: any;
  dropdownProps?: any;
}

export class DropOption extends PureComponent<IProps> {
  render() {
    const {
      onMenuClick,
      menuOptions = [],
      buttonStyle,
      dropdownProps
    } = this.props;
    const menu = menuOptions.map((item) => (
      <Menu.Item key={item.key}>{item.name}</Menu.Item>
    ));
    return (
      <Dropdown
        overlay={<Menu onClick={onMenuClick}>{menu}</Menu>}
        {...dropdownProps}
      >
        <Button style={{ border: 'none', ...buttonStyle }}>
          Sort
          <DownOutlined />
        </Button>
      </Dropdown>
    );
  }
}
