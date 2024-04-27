import PropTypes from 'prop-types';
import { Button, DatePicker, Space } from 'antd';
import Search from 'antd/es/transfer/search';
import React, { useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

type TableHeaderProps = {
  onSearch: (value: string) => void;
  params: any;
  setParams: any;
  titleDatePicker1: string;
  titleDatePicker2: string;
  isStore?: boolean;
};
export default function TableHeader({
  onSearch,
  params,
  setParams,
  titleDatePicker1,
  titleDatePicker2,
  isStore,
}: TableHeaderProps) {
  const {
    search,
    begin_date_register: beginDateRegister,
    end_date_register: endDateRegister,
    begin_last_visit_time: beginLastVisitRime,
    end_last_visit_time: endLastVisitTime,
    begin_date_expried: beginDateExpired,
    end_date_expried: endDateExpried,
  } = params;
  const keywordSearch = useDebounce(search, 500);
  const query = `page=1&search=${search}&begin_date_register=${beginDateRegister}&end_date_register=${endDateRegister}&begin_last_visit_time=${beginLastVisitRime}&end_last_visit_time=${endLastVisitTime}`;
  const queryStore = `page=1&search=${search}&begin_date_register=${beginDateExpired}&end_date_register=${endDateRegister}&begin_date_expried=${beginDateExpired}&end_date_expried=${endDateExpried}`;

  useEffect(() => {
    onSearch(isStore ? queryStore : query);
  }, [keywordSearch]);

  const changeParams = (key: string, value: any) => {
    setParams((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex justify-between my-3">
        <Space direction="vertical" style={{ width: 300 }} size="large">
          <Search placeholder="Tìm kiếm..." onChange={(e: any) => changeParams('search', e.target.value)} />
        </Space>
        <Button type="primary">Xuất Excel</Button>
      </div>

      <div className="flex justify-between my-5">
        <div>
          <p className="mb-2 font-semibold">{titleDatePicker1}:</p>
          <div>
            <span className="mr-1">Từ:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Từ ngày"
              onChange={(_, dateString) => changeParams('begin_date_register', dateString)}
            />
            <span className="mr-1 ml-2">Đến:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Đến ngày"
              onChange={(_, dateString) => changeParams('end_date_register', dateString)}
            />
            <Button type="primary" onClick={() => onSearch(query)}>
              Tìm kiếm
            </Button>
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold">{titleDatePicker2}:</p>
          <div>
            <span className="mr-1">Từ:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Từ ngày"
              onChange={(_, dateString) =>
                changeParams(`${isStore ? 'begin_date_expried' : 'begin_last_visit_time'}`, dateString)
              }
            />
            <span className="mr-1 ml-2">Đến:</span>
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Đến ngày"
              onChange={(_, dateString) =>
                changeParams(`${isStore ? 'end_date_expried' : 'end_last_visit_time'}`, dateString)
              }
            />
            <Button className="primary ml-2" onClick={() => onSearch(isStore ? queryStore : query)}>
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

TableHeader.propTypes = {
  titleDatePicker2: PropTypes.string,
  titleDatePicker1: PropTypes.string,
  setParams: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  params: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  isStore: PropTypes.bool,
};
