import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import './ConversationSearch.less';

interface IProps {
  onSearch: any;
}

export default function ConversationSearch({ onSearch }: IProps) {
  return (
    <div className="conversation-search">
      <SearchOutlined />
      <input
        onChange={onSearch}
        type="search"
        className="conversation-search-input"
        placeholder="Search contact..."
      />
    </div>
  );
}
