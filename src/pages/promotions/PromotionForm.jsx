import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Tooltip,
  Image,
  Modal,
  Table,
  Cascader,
  message,
} from 'antd';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ContentHeader from '../../components/content-header';
import Loading from '../../components/loading';
import { useVouchersStore } from '../../store/vouchersStore';
import { IntlNumberFormat, buildNestedArraysMenu, getPathByIndex, removeDuplicates } from '../../utils';

import { validateName, validateEndDate } from '../../utils/validate';
import { alerts } from '../../utils/alerts';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useProductsStore } from '../../store/productsStore';
import CustomSelect from '../../components/promotion/CustomeSlect';

const { Search } = Input;
const initialData = {
  name: '',
  start_time: '',
  end_time: '',
  discount_type: true,
  discount_value: '',
};

export default function PromotionForm() {
  const ShopId = getPathByIndex(2);
  const prdDiscountID = getPathByIndex(4);

  const [discountData, setDiscountData] = useState(initialData);

  const onChangeDiscountValue = (e, key, value) => {
    setDiscountData({ ...discountData, [key]: value });
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
          <ContentHeader title={prdDiscountID === 'discounts' ? 'Create product discount' : 'Edit product discount'} />
        </div>
        {/* top */}
        <Row className="p-10 pt-5 justify-between min-h-[465px]">
          {/* left */}
          <Col span={11}>
            <h2 className="my-4">Basic information</h2>
            <Form.Item
              label="Promotion name"
              name="name"
              labelAlign="left"
              className="font-medium"
              sx={{ width: '50%' }}
              rules={[
                {
                  required: true,
                  message: 'Promotion name is not visible to buyers!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const errorMessage = validateName(value);
                    if (errorMessage) {
                      return Promise.reject(errorMessage);
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            // initialValue={location?.state?.code}
            >
              <Input
                onChange={(e) => onChangeDiscountValue(e, 'name', e.target.value)}
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
                  name="start_time"
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
                // initialValue={location?.state?.start_time ? dayjs(location?.state?.start_time) : ''}
                >
                  <DatePicker
                    format="DD-MM-YYYY HH:mm:ss"
                    // onChange={handleChangeStartTime}
                    // disabledDate={disabledDate}
                    placeholder="Từ ngày"
                    showTime={{
                      defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                    }}
                  // defaultValue={
                  //   location?.state?.start_time ? dayjs(location?.state?.start_time, 'DD/MM/YYYY HH:mm:ss') : ''
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
                    // () => ({
                    //   validator(_, value) {
                    //     const validTimePass = validateEndDate(values.start_time, value);
                    //     if (validTimePass) {
                    //       return Promise.reject(errorMessage);
                    //     }
                    //     return Promise.resolve();
                    //   },
                    // }),
                  ]}
                // initialValue={location?.state?.end_time ? dayjs(location?.state?.end_time) : ''}
                >
                  <DatePicker
                    format="DD-MM-YYYY HH:mm:ss"
                    // onChange={handleChangeEndTime}
                    // disabledDate={disabledDate}
                    placeholder="Đến ngày"
                    showTime={{
                      defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                    }}
                  // defaultValue={location?.state?.end_time ? dayjs(location?.state?.end_time) : ''}
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
            // initialValue={discountType}
            >
              <Radio.Group
                options={[
                  { label: 'Percentage Off', value: true },
                  { label: 'Fixed Price', value: false },
                ]}
                // defaultValue={discountType}
                className="font-normal"
                // onChange={(e) => setDiscountType(e.target.value)}
                buttonStyle="solid"
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
        </Row>
        {/* space */}
        <Row className="h-4 bg-[#f5f5f5]" />
        {/* bottom */}
      </Form>
    </div>
  );
}
