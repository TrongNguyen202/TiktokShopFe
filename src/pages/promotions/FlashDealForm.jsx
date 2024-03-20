import { Button, Col, DatePicker, Form, Image, Input, Radio, Row, Tooltip, message } from 'antd';

import dayjs from 'dayjs';
import { useState } from 'react';
import ContentHeader from '../../components/content-header';

import { validateName } from '../../utils/validate';

import { usePromotionsStore } from '../../store/promotionsStore';

import { getPathByIndex } from '../../utils';

function FlashDealForm() {
  const initialData = {
    title: 'Flash',
    begin_time: dayjs().add(2, 'm'),
    end_time: dayjs().add(2, 'm').add(3, 'd'),
    type: 'FlashSale',
    discount: '15',
    product_type: 'SKU',
  };

  const [discountData, setDiscountData] = useState(initialData);
  const { createPromotion, loading } = usePromotionsStore((state) => state);

  const onChangeDiscountData = (e, key, value) => {
    setDiscountData({ ...discountData, [key]: value });
  };

  const disabledDate = (current) => {
    return current && current < dayjs().add(-1, 'd').endOf('day');
  };

  const onSubmit = () => {
    console.log(discountData);
    const onSuccess = () => {
      message.success(`Tạo promotion ${discountData?.title}  thành công`);
    };
    const onFail = () => {
      message.error('Tạo promotion thất bại');
    };

    const shopId = getPathByIndex(2);

    const submitData = {
      ...discountData,
      discount: Number(discountData.discount),
      begin_time: discountData.begin_time.unix(),
      end_time: discountData.end_time.unix(),
    };

    createPromotion(shopId, submitData, onSuccess, onFail);
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
        // onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <div className="ml-4">
          <ContentHeader title="Create flash sale" />
        </div>
        {/* top */}
        <Row className="p-10 pt-5 justify-between min-h-[465px]">
          {/* left */}
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
                  { label: 'Percentage Off', value: 'FlashSale' },
                  // { label: 'Fixed Price', value: 'FixedPrice' },
                ]}
                defaultValue={discountData.type}
                className="font-normal"
                onChange={(e) => setDiscountData(e, 'type', e.target.value)}
                buttonStyle="solid"
              />
            </Form.Item>

            <Form.Item
              label={`Discount ${discountData.type === 'FlashSale' ? '(%)' : '($)'}`}
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
          <Button disabled={loading} type="primary" className="" onClick={onSubmit}>
            Publish
          </Button>
        </Row>
        {/* bottom */}
      </Form>
    </div>
  );
}

export default FlashDealForm;
