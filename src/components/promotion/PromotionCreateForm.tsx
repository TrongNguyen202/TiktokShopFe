import { useState } from 'react';
import { Button, Col, DatePicker, Form, Image, Input, Radio, Row, Tooltip, Modal } from 'antd';
import React from 'react';

import dayjs from 'dayjs';
import { validateName } from '../../utils/validate';

import ContentHeader from '../../components/content-header';
import PromotionProduct from './PromotionProduct';
import PromotionSelectedProduct from './PromotionSelectedProduct';

type PromotionCreateFormProps = {
  initialData: any;
  loading: boolean;
  onSubmit: (data) => void;
};
}
function PromotionCreateForm({ initialData, loading, onSubmit }: PromotionCreateFormProps) {
  const [discountData, setDiscountData] = useState(initialData);
  const [openSelectProduct, setOpenSelectProduct] = useState(false);
  const [productSelected, setProductSelected] = useState([]);
  const disabledDate = (current) => {
    return current && current < dayjs().add(-1, 'd').endOf('day');
  };

  const onChangeDiscountData = (e, key, value) => {
    setDiscountData({ ...discountData, [key]: value });
  };

  const handleChangeStatusModal = (status) => {
    setOpenSelectProduct(status);
  };

  const handleGetProductSelected = (data) => {
    setProductSelected(data);
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 24,
        }}
        autoComplete="off"
        layout="vertical"
      >
        <div className="ml-4">
          <ContentHeader
            title={`Create ${discountData.type === 'DirectDiscount' ? 'Product Discount' : 'Flash Deal'}`}
          />
        </div>

        <Row className="p-10 pt-5 justify-between min-h-[465px]">
          <Col span={11}>
            <h2 className="my-4">Basic information</h2>
            <Form.Item
              label="Promotion name"
              name="title"
              labelAlign="left"
              className="font-medium"
              sx={{ width: '50%' }}
              rules={[
                {
                  required: true,
                  message: 'Promotion name is not visible to buyers!',
                },
                () => ({
                  validator(_, value) {
                    const errorMessage = validateName(value);
                    if (errorMessage) {
                      return Promise.reject(errorMessage);
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              initialValue={discountData?.title}
            >
              <Input
                onChange={(e) => onChangeDiscountData(e, 'title', e.target.value)}
                className="w-2/3"
                placeholder="Nhập tên chương trình"
                // defaultValue={location?.state?.name}
              />
            </Form.Item>

            <div className="flex align-middle">
              <span className="text-sm font-semibold">Promotion period(PST)</span>
              <Tooltip className="ml-2" placement="top" title="the maximum promotion period day is 30 days">
                <span className="rounded-full bg-gray-300 w-6 h-6 flex items-center justify-center border-2 border-gray-400 text-center mt-[2px] font-bold">
                  !
                </span>
              </Tooltip>
            </div>

            {/* date picker */}
            <Row>
              <Col span={24} md={{ span: 12 }}>
                <Form.Item
                  label="Thời gian bắt đầu"
                  name="begin_time"
                  labelAlign="left"
                  className="font-medium"
                  labelCol={{
                    span: 24,
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn ngày bắt đầu!',
                    },
                  ]}
                >
                  <DatePicker
                    format="DD-MM-YYYY HH:mm"
                    // onChange={handleChangeStartTime}
                    disabledDate={disabledDate}
                    placeholder="Từ ngày"
                    showTime={{
                      defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                    }}
                    defaultValue={discountData.begin_time}
                    // defaultValue={
                    //   location?.state?.begin_time ? dayjs(location?.state?.begin_time, 'DD/MM/YYYY HH:mm:ss') : ''
                    // }
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={{ span: 12 }}>
                <Form.Item
                  label="Thời gian kết thúc"
                  name="end_time"
                  labelAlign="left"
                  className="font-medium"
                  labelCol={{
                    span: 24,
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn ngày kết thúc!',
                    },
                  ]}
                >
                  <DatePicker
                    format="DD-MM-YYYY HH:mm"
                    // onChange={handleChangeEndTime}
                    // disabledDate={disabledDate}
                    placeholder="Đến ngày"
                    showTime={{
                      defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                    }}
                    defaultValue={discountData.end_time}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Discount type"
              name="set_limit_total"
              className="font-medium mb-[11px]"
              labelAlign="left"
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn discount type!',
                },
              ]}
            >
              <Radio.Group
                options={[
                  { label: 'Percentage Off', value: 'DirectDiscount' },
                  // { label: 'Fixed Price', value: 'FixedPrice' },
                ]}
                // defaultValue={discountData.type}
                defaultValue="DirectDiscount"
                className="font-normal"
                onChange={(e) => setDiscountData(e, 'type', e.target.value)}
                buttonStyle="solid"
              />
            </Form.Item>

            <Button className="mb-5" onClick={() => setOpenSelectProduct(true)}>
              Select Product
            </Button>

            <Form.Item
              label="Discount (%)"
              name="discount"
              labelAlign="left"
              className="font-medium"
              sx={{ width: '50%' }}
            >
              <Input
                onChange={(e) => onChangeDiscountData(e, 'discount', e.target.value)}
                className="w-2/3"
                placeholder="Discount value"
                defaultValue={discountData.discount}
              />
            </Form.Item>
          </Col>

          {/* right */}
          <Col span={12}>
            <Row gutter={[30, 300]}>
              <Col span={12}>
                <Image
                  width={200}
                  src="https://lf16-cdn-tos.tiktokcdn-us.com/obj/static-tx/i18n/ecom/TTS/normal/promotion/static/media/pdp.b940b71e.png"
                />
              </Col>
              <Col span={12}>
                <Image
                  width={200}
                  src="https://lf16-cdn-tos.tiktokcdn-us.com/obj/static-tx/i18n/ecom/TTS/normal/promotion/static/media/live-stream.3c747bf8.png"
                />
              </Col>
            </Row>
          </Col>

          {productSelected.length > 0 && (
            <PromotionSelectedProduct
              promotionType={initialData.type}
              data={productSelected}
              discount={discountData.discount}
            />
          )}

          <Button
            disabled={loading}
            type="primary"
            className=""
            onClick={() => onSubmit(discountData, productSelected)}
          >
            Publish
          </Button>
        </Row>
      </Form>

      <Modal
        title="Select Products"
        centered
        open={openSelectProduct}
        onCancel={() => setOpenSelectProduct(false)}
        width={1000}
        footer={false}
      >
        <PromotionProduct
          changeStatusModal={handleChangeStatusModal}
          dataProductSelected={handleGetProductSelected}
          promotionType={initialData.type}
        />
      </Modal>
    </div>
  );
}

export default PromotionCreateForm;
