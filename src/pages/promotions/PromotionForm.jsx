import { Button, Col, DatePicker, Form, Image, Input, Radio, Row, Tooltip, message, Modal } from 'antd';

import dayjs from 'dayjs';
import { useState } from 'react';
import ContentHeader from '../../components/content-header';

import { validateName } from '../../utils/validate';

import { usePromotionsStore } from '../../store/promotionsStore';

import { getPathByIndex } from '../../utils';
import PromotionProduct from '../../components/promotion/PromotionProduct';
import PromotionSelectedProduct from '../../components/promotion/PromotionSelectedProduct';

export default function PromotionForm() {
  const shopId = getPathByIndex(2);
  const initialData = {
    title: 'Discount',
    begin_time: dayjs().add(2, 'm'),
    end_time: dayjs().add(2, 'm').add(30, 'd'),
    type: 'DirectDiscount',
    discount: '15',
    product_type: 'SPU',
  };

  const [discountData, setDiscountData] = useState(initialData);
  const [openSelectProduct, setOpenSelectProduct] = useState(false);
  const [productSelected, setProductSelected] = useState([]);
  const { createPromotion, loading } = usePromotionsStore((state) => state);

  const onChangeDiscountData = (e, key, value) => {
    setDiscountData({ ...discountData, [key]: value });
  };

  const onSubmit = () => {
    // console.log(discountData);
    const onSuccess = () => {
      message.success(`Tạo promotion ${discountData?.title}  thành công`);
    };
    const onFail = (err) => {
      message.error(`Tạo promotion thất bại. ${err}`);
    };

    let submitData = {
      ...discountData,
      begin_time: discountData.begin_time.unix(),
      end_time: discountData.end_time.unix(),
      product_list: productSelected.map(item => ({
        product_id: item.id,
        num_limit: -1, 
        user_limit: -1,
        discount: discountData.discount
      }))
    };

    delete submitData.discount;

    console.log('submitData: ', submitData);

    createPromotion(shopId, submitData, onSuccess, onFail);
  };

  const handleChangeStatusModal = (status) => {
    setOpenSelectProduct(status)
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
        // onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <div className="ml-4">
          <ContentHeader title="Create product discount" />
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
                  // initialValue={location?.state?.begin_time ? dayjs(location?.state?.begin_time) : ''}
                >
                  <DatePicker
                    format="DD-MM-YYYY HH:mm"
                    // onChange={handleChangeStartTime}
                    // disabledDate={disabledDate}
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
                    // defaultValue={location?.state?.end_time ? dayjs(location?.state?.end_time) : ''}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Discount type"
              name="type"
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
              initialValue={discountData.type}
            >
              <Radio.Group
                options={[
                  { label: 'Percentage Off', value: 'DirectDiscount' },
                  // { label: 'Fixed Price', value: 'FixedPrice' },
                ]}
                defaultValue={discountData.type}
                className="font-normal"
                onChange={(e) => setDiscountData(e, 'type', e.target.value)}
                buttonStyle="solid"
              />
            </Form.Item>

            <Button className="mb-5" onClick={() => setOpenSelectProduct(true)}>Select Product</Button>

            <Form.Item
              label={`Discount ${discountData.type === 'DirectDiscount' ? '(%)' : '($)'}`}
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

          {productSelected.length > 0 && <PromotionSelectedProduct data={productSelected}/>}

          <Button disabled={loading} type="primary" htmlType="submit" className="" onClick={onSubmit}>
            Publish
          </Button>
        </Row>
        {/* bottom */}
      </Form>

      <Modal
        title="Select Products"
        centered
        open={openSelectProduct}
        onCancel={() => setOpenSelectProduct(false)}
        width={1000}
        footer={false}
      >
        <PromotionProduct changeStatusModal={handleChangeStatusModal} dataProductSelected={handleGetProductSelected}/>
      </Modal>
    </div>
  );
}
