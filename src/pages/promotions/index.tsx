import React, { useEffect, useState } from 'react';
import { Tabs, Row, Col, Card, Button, Select, Input, Table, Tag, Spin, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import PageTitle from '../../components/common/PageTitle';
import { getPathByIndex } from '../../utils';
import { alerts } from '../../utils/alerts';
import { RepositoryRemote } from '../../services';
import { useDebounce } from '../../hooks/useDebounce';
import { usePromotionsStore } from '../../store/promotionsStore';

const { Search } = Input;

interface PromotionProps {
  promotion_id: string;
  title: string;
  status: any;
  begin_time: string;
  end_time: string;
  promotion_type: number;
}

function Promotion() {
  const shopId = getPathByIndex(2);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [promotionsData, setPromotionsData] = useState([]);
  const [refreshPromotion, setRefreshPromotion] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [promotionSelected, setPromotionSelected] = useState<string[]>([]);
  const { InactivePromotion, loading } = usePromotionsStore((state) => state);

  const debouncedSearchValue = useDebounce(searchValue, 1000);
  // console.log('promotionsData: ', promotionsData);

  const rowSelection = {
    onChange: (_: any, selectedRows: PromotionProps[]) => {
      const dataSelect = selectedRows.map((item) => item.promotion_id);
      setPromotionSelected(dataSelect as string[]);
    },
    getCheckboxProps: (record: PromotionProps) => ({
      disabled: record.status.props.children !== 'Ongoing',
    }),
  };

  const columns: TableColumnsType<PromotionProps> = [
    {
      title: 'Promotion name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Start time(PST)',
      dataIndex: 'begin_time',
      key: 'begin_time',
    },
    {
      title: 'End time(PST)',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: 'Type',
      dataIndex: 'promotion_type',
      key: 'promotion_type',
    },
  ];

  const handleInactivePromotion = () => {
    const dataSubmit = {
      promotion_ids: promotionSelected,
    };

    const onSuccess = (res: any) => {
      if (res) {
        console.log('res: ', res);
        setPromotionSelected([]);
        setRefreshPromotion(true);
        messageApi.open({
          type: 'success',
          content: res.map((item: any) => `Dừng ${item} thành công`),
        });
      }
    };

    if (shopId) InactivePromotion(shopId, dataSubmit, onSuccess, () => {});
  };

  const renderStatusPromotion = (record: PromotionProps) => {
    if (record.status === 1) {
      return <Tag color="processing">Upcoming</Tag>;
    }
    if (record.status === 2) {
      return <Tag color="success">Ongoing</Tag>;
    }
    if (record.status === 3) {
      return <Tag color="error">Expired</Tag>;
    }
    return <Tag color="default">Deactivated</Tag>;
  };

  const fetchPromotions = async () => {
    if (shopId) {
      const { data }: any = await RepositoryRemote.promotions.getPromotions(shopId, 1, searchValue, filterStatus);
      if (data.success === false) {
        alerts.error(data.message);

        return;
      }

      const promotions = data.promotion_list.map((promotion: PromotionProps) => {
        const begin_time: string = new Date((promotion.begin_time as unknown as number) * 1000).toLocaleString(
          'en-US',
          {
            timeZone: 'America/Los_Angeles',
          },
        );
        const end_time: string = new Date((promotion.end_time as unknown as number) * 1000).toLocaleString('en-US', {
          timeZone: 'America/Los_Angeles',
        });
        return {
          ...promotion,
          begin_time,
          end_time,
          promotion_type: promotion.promotion_type === 3 ? 'Flash sale' : 'Discount',
          status: renderStatusPromotion(promotion),
        };
      });

      setPromotionsData(promotions);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [debouncedSearchValue, filterStatus, refreshPromotion]);

  const items = [
    {
      key: '1',
      label: 'Manage your promotions',
      children: (
        <div className="w-full">
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <div className="lg:w-[calc(100%/3)]">
              <Select
                defaultValue="all"
                style={{
                  width: '90%',
                }}
                onChange={(value) => setFilterStatus(value)}
                options={[
                  {
                    value: 'all',
                    label: 'All statuses',
                  },
                  {
                    label: 'Upcoming',
                    value: '1',
                  },
                  {
                    label: 'Ongoing',
                    value: '2',
                  },
                  {
                    value: '3',
                    label: 'Expired',
                  },
                  {
                    value: '4',
                    label: 'Deactivated',
                  },
                ]}
              />
            </div>
            <div className="lg:flex-1">
              <Search placeholder="Enter promotion name" onChange={(e) => setSearchValue(e.target.value)} />
            </div>
            <Button type="primary" disabled={!promotionSelected.length} onClick={handleInactivePromotion}>
              Stop promotion ({promotionSelected?.length || '0'})
              {promotionSelected.length > 0 && loading && (
                <Spin
                  indicator={
                    <LoadingOutlined
                      className="text-white ml-3"
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  }
                />
              )}
            </Button>
          </div>
          <div className="mt-8">
            <Table
              columns={columns}
              dataSource={promotionsData}
              bordered
              pagination={{ pageSize: 30 }}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: promotionSelected,
                ...rowSelection,
              }}
              rowKey={(record) => record.promotion_id}
            />
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Create a promotion',
      children: (
        <div className="w-full">
          <Row gutter={[30, 30]}>
            <Col md={{ span: 12 }} span={24} className="cursor-pointer">
              <Card style={{ padding: '10px' }}>
                <h2>Product discount</h2>
                <p className="h-6 overflow-hidden text-ellipsis">
                  Set daily discounts to generate interest and boost sales.
                </p>
                <div className="mt-4">
                  <Button type="primary" onClick={() => navigate(`/shops/${shopId}/promotions/discounts`)}>
                    Create
                  </Button>
                </div>
              </Card>
            </Col>

            <Col md={{ span: 12 }} span={24} className="cursor-pointer">
              <Card style={{ padding: '10px' }}>
                <h2>Flash Deal</h2>
                <p className="h-6 overflow-hidden text-ellipsis">
                  Offer limited-time deals to incentivize swift purchases, sell excess inventory or attract new buyers.
                </p>
                <div className="mt-4">
                  <Button type="primary" onClick={() => navigate(`/shops/${shopId}/promotions/flash-deal`)}>
                    Create
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-10">
      {contextHolder}
      <PageTitle title="Promotion" showBack />
      <Tabs className="w-full" defaultActiveKey="1" items={items} />
    </div>
  );
}

export default Promotion;
