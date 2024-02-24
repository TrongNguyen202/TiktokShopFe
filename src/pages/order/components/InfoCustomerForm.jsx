import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Spin,
    Switch,
  } from "antd";
  import TextArea from "antd/es/input/TextArea";
//   import { useBranchesStore } from "../../store/branchesStore";
  import { useAddressStore } from "../../../store/addressStore";
  import { alerts } from "../../../utils/alerts";
  import PropTypes from "prop-types";
  
export default function InfoCustomerForm({ selectedAddress, onSubmit, orderExists }) {
    const { getDistrict, districts, getWards, wards, resetDistrictAndWard } =
      useAddressStore();
    const provinces = JSON.parse(localStorage.getItem("provinces"));
  
    const onChangeProvince = (id) => {
      getDistrict(id, () => {
        alerts.error("Có lỗi xảy ra");
      });
      resetDistrictAndWard();
    };
  
    const onChangeDistrict = (id) => {
      getWards(id, () => {
        alerts.error("Có lỗi xảy ra");
      });
    };
  
    const transformedData = (data) => {
      if(!data || !data.length) return []
      return data.map((item) => {
        return { label: item.name, value: item.id };
      });
    };
  
    return (
      <Spin spinning={false}>
        <Form
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 24,
          }}
          onFinish={onSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Row className="justify-between" gutter={[15]}></Row>

          {/* 
          <Row className="justify-start" gutter={[15]}>
            <Col span={8}>
              <Form.Item
                label="Mã kho"
                name="branch_code"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                initialValue={selectedAddress?.branch_code || ""}
              >
                <Input placeholder="Mã kho" type="text" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Mã số thuế"
                name="txt_code"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                initialValue={selectedAddress?.email || ""}
              >
                <Input placeholder="Nhập mã số thuế" />
              </Form.Item>
            </Col>
          </Row> */}
  
          {/* <Row className="justify-between" gutter={[15]}>
            <Col span={8}>
              <Form.Item
                label="Tên người đặt hàng"
                name="name"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người đặt hàng",
                    },
                  ]}
                initialValue={orderExists?.customer?.name || ""}
              >
                <Input placeholder="Tên người đặt hàng" disabled type="text" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Số điện thoại người đặt"
                name="phone_number"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                ]}
                initialValue={orderExists?.customer?.phone_number || ""}
              >
                <Input placeholder="Nhập số điện thoại" disabled type="number" />
              </Form.Item>
            </Col>
            <Col span={8}>
            </Col>
          </Row> */}
          <Row className="justify-between" gutter={[15]}>
            <Col span={8}>
              <Form.Item
                label="Tên người nhận hàng"
                name="customer_name"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người nhận hàng",
                    },
                  ]}
                initialValue={orderExists?.customer_name|| ""}
              >
                <Input placeholder="Tên người nhận hàng" type="text" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Số điện thoại người nhận"
                name="customer_phone"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                ]}
                initialValue={orderExists?.customer_phone || ""}
              >
                <Input placeholder="Nhập số điện thoại" type="number" />
              </Form.Item>
            </Col>
            <Col span={8}>
            </Col>
          </Row>
  
          <Row className="justify-between" gutter={[15]}>
            <Col span={8}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="province"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn tỉnh thành phố",
                  },
                ]}
                initialValue={selectedAddress?.province}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Chọn tỉnh, thành phố"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(e) => onChangeProvince(e)}
                  defaultValue={selectedAddress?.province}
                  value={selectedAddress?.province}
                  options={transformedData(provinces)}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Quận/Huyện"
                name="district"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn quận huyện",
                  },
                ]}
                initialValue={selectedAddress?.district}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Chọn quận, huyện"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(e) => onChangeDistrict(e)}
                  defaultValue={selectedAddress?.district}
                  value={selectedAddress?.district}
                  options={transformedData(districts)}
                  disabled={districts.length ? false : true}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Phường/Xã"
                name="wards"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phường xã",
                  },
                ]}
                initialValue={selectedAddress?.wards}
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Chọn phường xã"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  defaultValue={selectedAddress?.wards}
                  options={transformedData(wards)}
                  disabled={wards.length ? false : true}
                />
              </Form.Item>
            </Col>
          </Row>
  
          <Form.Item
            label="Địa chỉ chi tiết"
            name="customer_address_detail"
            labelAlign="left"
            className="font-medium mb-4"
            sx={{ width: "100%" }}
            labelCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ chi tiết",
              },
            ]}
            initialValue={orderExists?.customer_address_detail}
          >
            <TextArea placeholder="Địa chỉ chi tiết" />
          </Form.Item>

          <Form.Item
            label="Ghi chú"
            name="customer_note"
            labelAlign="left"
            className="font-medium mb-4"
            sx={{ width: "100%" }}
            labelCol={{
              span: 24,
            }}
            initialValue={orderExists?.customer_note}
          >
            <TextArea placeholder="Nhập ghi chú cho đơn hàng" />
          </Form.Item>
  
          <div className="w-[300px] mx-auto">
            <Button
              className="mt-4"
              block
              type="primary"
              htmlType="submit"
              width={200}
            >
              {"Lưu thay đổi"}
            </Button>
          </div>
        </Form>
      </Spin>
    );
  }
  
  InfoCustomerForm.propTypes = {
    selectedAddress: PropTypes.object,
    onSubmit: PropTypes.func,
    orderExists: PropTypes.object,
  };