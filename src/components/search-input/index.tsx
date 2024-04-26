import { Space } from 'antd';
import Search from 'antd/es/transfer/search';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '../../hooks/useDebounce';

type SearchInputProps = {
  keyword: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
};
export default function SearchInput({ keyword, onChange, onSearch }: SearchInputProps) {
  const keywordSearch = useDebounce(keyword, 500);

  useEffect(() => {
    onSearch(keyword);
  }, [keywordSearch]);

  return (
    <div>
      <Space direction="vertical" style={{ width: 300 }} size="large">
        <Search placeholder="Tìm kiếm..." name="search" onChange={(e) => onChange(e.target.value)} />
      </Space>
    </div>
  );
}

SearchInput.propTypes = {
  keyword: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};
