import React from "react";

import { Tabs, Row, Col, Card, Button } from "antd";
import PageTitle from "../../components/common/PageTitle";
import { useNavigate } from "react-router-dom";

const Promotion = ({ shopId }) => {
  const navigate = useNavigate();

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
      children: "Content of Tab Pane 2",
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
