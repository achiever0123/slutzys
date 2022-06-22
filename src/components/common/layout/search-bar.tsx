import { PureComponent } from 'react';
import { Input } from 'antd';
import Router from 'next/router';
import './search-bar.less';

const { Search } = Input;
interface IProps {}

class SearchBar extends PureComponent<IProps> {
  onSearch = (q) => {
    if (!q || !q.trim()) return;
    Router.push({ pathname: '/search', query: { q } });
  };

  render() {
    return (
      <div className="search-bar">
        <Search
          placeholder="Type to search here ..."
          allowClear
          enterButton
          onPressEnter={(e: any) => this.onSearch(e?.target?.value)}
          onSearch={this.onSearch.bind(this)}
        />
      </div>
    );
  }
}

export default SearchBar;
