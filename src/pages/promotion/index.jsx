import React from "react";

import { Tabs, Row, Col, Card, Button, Select, Input, Table } from "antd";
import PageTitle from "../../components/common/PageTitle";
import { useNavigate } from "react-router-dom";
import { getPathByIndex } from "../../utils";

const { Search } = Input;

// define table
const columns = [
  {
    title: "Promotion name",
    dataIndex: "shipping_provider",
    key: "shipping_provider",
  },
  {
    title: "Status",
    dataIndex: "shipping_provider",
    key: "shipping_provider",
  },
  {
    title: "Start time(PST)",
    dataIndex: "shipping_provider",
    key: "shipping_provider",
  },
  {
    title: "End time(PST)",
    dataIndex: "shipping_provider",
    key: "shipping_provider",
  },
  {
    title: "Type",
    dataIndex: "shipping_provider",
    key: "shipping_provider",
  },
  {
    title: " Action",
    dataIndex: "shipping_provider",
    key: "shipping_provider",
  },
];

const Promotion = () => {
  const shopId = getPathByIndex(2);
  const navigate = useNavigate();

  const itemsManageTab = [
    {
      key: "1",
      label: "Tab 1",
      children: (
        <div className="w-full">
          <Row className="mt-8">
            <Col span={8}>
              <Select
                defaultValue="lucy"
                style={{
                  width: "90%",
                }}
                // onChange={handleChangeCategories}
                options={[
                  {
                    value: "jack",
                    label: "All promotional tools",
                  },
                  {
                    value: "lucy",
                    label: "Coupon",
                  },
                  {
                    value: "Yiminghe",
                    label: "Flash Deal",
                  },
                  {
                    label: "Shipping fee discount",
                    value: "Yiminghe",
                  },
                  {
                    label: "Product discount",
                    value: "Yiminghe",
                  },
                ]}
              />
            </Col>
            <Col span={16}>
              <Search
                placeholder="Enter promotion name"
                // onSearch={onSearch}
              />
            </Col>
          </Row>
          <div className="mt-8 pr-2">
            <Table
              columns={columns}
              // dataSource={sortByPackageId(orders)}
              dataSource={[]}
              // loading={loadin-g}
              bordered
              pagination={{ pageSize: 100 }}
              //   rowKey={(record) => record.package_list[0]?.package_id}
            />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];

  const items = [
    {
      key: "1",
      label: "Create a promotion",
      children: (
        <div className="w-full">
          <Row gutter={[30, 30]}>
            <Col md={{ span: 12 }} span={24} className="cursor-pointer">
              <Card style={{ padding: "10px" }}>
                <h2>Product discount</h2>
                <p className="h-6 overflow-hidden text-ellipsis">
                  Set daily discounts to generate interest and boost sales.
                </p>
                <div className="mt-4">
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate(
                        `/shops/${shopId}/promotions/create-prd-discount`
                      )
                    }
                  >
                    Create
                  </Button>
                  <Button className="ml-4">Learn more</Button>
                </div>
              </Card>
            </Col>

            <Col md={{ span: 12 }} span={24} className="cursor-pointer">
              <Card style={{ padding: "10px" }}>
                <h2>Flash Deal</h2>
                <p className="h-6 overflow-hidden text-ellipsis">
                  Offer limited-time deals to incentivize swift purchases, sell
                  excess inventory or attract new buyers.
                </p>
                <div className="mt-4">
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate(`/shops/${shopId}/promotions/create-flash-deal`)
                    }
                  >
                    Create
                  </Button>
                  <Button className="ml-4">Learn more</Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "2",
      label: "Manage your promotions",
      children: (
        <div className="w-full">
          <Tabs defaultActiveKey="1" items={itemsManageTab} />
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
        <Row className="mt-8">
          <Tabs defaultActiveKey="1" items={items} />
        </Row>
      </Col>
    </Row>
  );
};

export default Promotion;
