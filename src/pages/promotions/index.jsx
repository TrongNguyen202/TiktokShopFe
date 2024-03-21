import React, { useEffect, useState } from 'react';

import { Tabs, Row, Col, Card, Button, Select, Input, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../components/common/PageTitle';
import { getPathByIndex } from '../../utils';
import { alerts } from '../../utils/alerts';
import { RepositoryRemote } from '../../services';
import { usePromotionsStore } from '../../store/promotionsStore';

const { Search } = Input;

const columns = [
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
  {
    title: ' Action',
    dataIndex: 'action',
    key: 'action',
  },
];

function Promotion() {
  const shopId = getPathByIndex(2);
  const navigate = useNavigate();
  const [promotionsData, setPromotionsData] = useState([]);
  // const [promotions, getPromotions, loading] = usePromotionsStore((state) => state);

  const getPromotions = async () => {
    const { data } = await RepositoryRemote.promotions.getPromotions(shopId, 1);
    if (data.success === false) {
      alerts.error(data.message);

      return;
    }

    const promotions = data.promotion_list.map((promotion) => {
      return {
        ...promotion,
        begin_time: new Date(promotion.begin_time * 1000).toLocaleString({
          timeZone: 'America/Los_Angeles',
        }),
        end_time: new Date(promotion.end_time * 1000).toLocaleString({
          timeZone: 'America/Los_Angeles',
        }),
        promotion_type: promotion.promotion_type === 3 ? 'Flash sale' : 'Discount',
        status:
          promotion.status === 1
            ? 'Upcoming'
            : promotion.status === 2
              ? 'Ongoing'
              : promotion.status === 3
                ? 'Expired'
                : 'Deactivated',
      };
    });

    setPromotionsData(promotions);
  };

  useEffect(() => {
    // getPromotions(shopId);

    getPromotions();
  }, []);

  // useEffect(() => {
  //   setPromotionsData(promotions);
  // }, [promotions]);

  const items = [
    {
      key: '1',
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
    {
      key: '2',
      label: 'Manage your promotions',
      children: (
        <div className="w-full">
          <Row className="mt-8">
            <Col span={8}>
              <Select
                defaultValue="all"
                style={{
                  width: '90%',
                }}
                // onChange={handleChangeCategories}
                options={[
                  {
                    value: 'all',
                    label: 'All promotions',
                  },
                  // {
                  //   value: 'Coupon',
                  //   label: 'Coupon',
                  // },
                  {
                    value: 'FlashSale',
                    label: 'Flash Deal',
                  },
                  // {
                  //   label: 'Shipping fee discount',
                  //   value: 'Shipping',
                  // },
                  {
                    label: 'Product discount',
                    value: 'ProductDiscount',
                  },
                ]}
              />
            </Col>
            <Col span={16}>
              <Search placeholder="Enter promotion name" />
            </Col>
          </Row>
          <div className="mt-8 pr-2">
            <Table columns={columns} dataSource={promotionsData} bordered pagination={{ pageSize: 100 }} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <Row gutter={[30, 30]} className="p-4 md:p-10">
      <Col>
        <div>
          <PageTitle title="Promotion" showBack />
        </div>
        <Row className="mt-8 w-full">
          <Tabs className="w-full" defaultActiveKey="1" items={items} />
        </Row>
      </Col>
    </Row>
  );
}

export default Promotion;
