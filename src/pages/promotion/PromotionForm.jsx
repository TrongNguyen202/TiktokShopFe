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
} from "antd";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContentHeader from "../../components/content-header";
import Loading from "../../components/loading";
import { useVouchersStore } from "../../store/vouchersStore";
import {
  IntlNumberFormat,
  buildNestedArraysMenu,
  getPathByIndex,
  removeDuplicates,
} from "../../utils";

import { validateName, validateEndDate } from "../../utils/validate";
import { alerts } from "../../utils/alerts";
import { useCategoriesStore } from "../../store/categoriesStore";
import { useProductsStore } from "../../store/productsStore";
import CustomSelect from "../../components/promotion/CustomeSlect";

const { Search } = Input;

export default function PromotionForm() {
  const ShopId = getPathByIndex(2);
  const prdDiscountID = getPathByIndex(4);
  const navigate = useNavigate();
  const location = useLocation();
  const { createVoucher, updateVoucher } = useVouchersStore((state) => state);

  const [discountType, setDiscountType] = useState(
    location?.state?.discount_type || 0
  );

  const [variations, setVariations] = useState(
    location?.state?.variations || 0
  );
  // categories zustand
  const { categoriesIsLeaf, getAllCategoriesIsLeaf, getAttributeByCategory } =
    useCategoriesStore((state) => state);
  const categoriesData = buildNestedArraysMenu(categoriesIsLeaf, 0);

  // product zustand
  const { products, getAllProducts, loading, infoTable } = useProductsStore(
    (state) => state
  );

  //use state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowKeysPrdSelected, setSelectedRowKeysPrdSelected] = useState(
    []
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [prdSelected, setPrdSelected] = useState([]);
  const [dealPrice, setDealPrice] = useState(1);

  const productForm = prdSelected.map((product, key) => {
    return {
      ...product,
      key: key,
    };
  });

  console.log("object", productForm);

  const onSubmit = (value) => {
    const onSuccess = () => {
      alerts.success(
        prdDiscountID === "create-prd-discount"
          ? "Tạo thành công"
          : "Cập nhật thành công"
      );
      navigate(-1);
    };
    const onFail = (error) => {
      alerts.error(error);
    };
    if (prdDiscountID === "create-prd-discount")
      createVoucher(
        { ...value, set_limit_amount: !!value.remain },
        onSuccess,
        onFail
      );
    else
      updateVoucher(
        prdDiscountID,
        { ...value, set_limit_amount: !!value.remain },
        onSuccess,
        onFail
      );
  };

  //logic datepicker
  const handleChangeStartTime = (day) => {
    return day;
  };
  const handleChangeEndTime = (day, dateString) => {
    console.log("end timeeeeee", dateString);
    return day;
  };
  // disable after today
  const disabledDate = (current) => {
    // Calculate the time difference between the selected date and current time
    const timeDifference = dayjs()
      .startOf("day")
      .diff(current.startOf("day"), "days");

    // Disable if the time difference is greater than or equal to 1
    return timeDifference >= 1;
  };

  //logic open modal
  const showModal = () => {
    setIsModalOpen(true);
    const onSuccess = (res) => {
      getAllCategoriesIsLeaf();
    };

    const onFail = (err) => {
      alerts.error(err);
    };

    getAllProducts(ShopId, 1, onSuccess, onFail);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // select catagory on modal
  const handleChangeCategories = (value) => {
    console.log(`selected ${value}`);
  };

  //logic table modal selected row
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setPrdSelected(selectedRows);
  };

  //logic table prd selected row
  const onSelectedPrdChange = (newSelectedRowKeys) => {
    setSelectedRowKeysPrdSelected(newSelectedRowKeys);
  };

  //logic table modal selected row
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //logic table prd selected row
  const rowSelectionTable = {
    selectedRowKeysPrdSelected,
    onChange: onSelectedPrdChange,
  };

  // logic select in modal in table
  const handleChangeCategoriesModal = (e) => {
    const categoryId = e[e?.length - 1];
    const onSuccess = (res) => {
      getAttributeValues(res.data.attributes);
    };

    const onFail = (err) => {
      messageApi.open({
        type: "error",
        content: err,
      });
    };
    getAttributeByCategory(ShopId, categoryId, onSuccess, onFail);
  };

  // logic delete prd on prdselected table
  const handleDeleteProduct = (productId) => {
    const updatedPrdSelected = prdSelected.filter(
      (product) => product.id !== productId
    );
    setPrdSelected(updatedPrdSelected);
  };

  // logic search on table on modal
  const onSearchTable = () => {};

  // define table colums
  const columns = [
    {
      title: "product name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "original price",
      dataIndex: ["skus", "price"],
      key: "price",
      align: "center",
      render: (_, record) => {
        const listPrice = record?.skus?.map(
          (item) => item?.price?.original_price || 0
        );
        const current = removeDuplicates(
          record?.skus?.map((item) => item?.price?.currency || "USD"),
          "currency"
        );
        const minPrice = IntlNumberFormat(
          current,
          "currency",
          3,
          Math.min(...listPrice)
        );
        const maxPrice = IntlNumberFormat(
          current,
          "currency",
          3,
          Math.max(...listPrice)
        );
        return (
          <>
            {minPrice === maxPrice && <span>{minPrice}</span>}
            {minPrice !== maxPrice && (
              <span>
                {minPrice} - {maxPrice}
              </span>
            )}
          </>
        );
      },
    },
  ];

  // define column PrdSelected
  const columnsPrdSelected = [
    {
      title: "product name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "original price",
      dataIndex: ["skus", "price"],
      key: "price",
      align: "center",
      render: (_, record) => {
        const listPrice = record?.skus?.map(
          (item) => item?.price?.original_price || 0
        );
        const current = removeDuplicates(
          record?.skus?.map((item) => item?.price?.currency || "USD"),
          "currency"
        );
        const minPrice = IntlNumberFormat(
          current,
          "currency",
          3,
          Math.min(...listPrice)
        );
        const maxPrice = IntlNumberFormat(
          current,
          "currency",
          3,
          Math.max(...listPrice)
        );
        return (
          <>
            {minPrice === maxPrice && <span>{minPrice}</span>}
            {minPrice !== maxPrice && (
              <span>
                {minPrice} - {maxPrice}
              </span>
            )}
          </>
        );
      },
    },
    {
      title: "Deal Price",
      dataIndex: ["skus", "price"],
      key: "price",
      align: "center",
      render: (_, record) => {
        const listPrice = record?.skus?.map(
          (item) => item?.price?.original_price || 0
        );
        const current = removeDuplicates(
          record?.skus?.map((item) => item?.price?.currency || "USD"),
          "currency"
        );
        const minPrice = Number(Math.min(...listPrice));
        const maxPrice = Number(Math.max(...listPrice));

        return (
          <div>
            <Input
              onChange={(e) => setDealPrice(e.target.value)}
              placeholder={`${discountType === true ? "%" : "$"}`}
              type="number"
              className="w-32 mt-6"
            />
            <div>
              {minPrice === maxPrice && (
                <span>
                  {isNaN(minPrice)
                    ? "Invalid price"
                    : discountType === true
                      ? Number(minPrice * (dealPrice / 100))
                      : Number(minPrice - dealPrice)}
                </span>
              )}
              {minPrice !== maxPrice && (
                <span className="text-xs">
                  {isNaN(minPrice) || isNaN(maxPrice)
                    ? "Invalid price"
                    : `${
                        discountType === true
                          ? Number(minPrice * (dealPrice / 100))
                          : Number(minPrice - dealPrice)
                      } - ${
                        discountType === true
                          ? Number(maxPrice * (dealPrice / 100))
                          : Number(maxPrice - dealPrice)
                      }`}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Total Purchase Limit",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <Input placeholder="No limit" type="number" className="w-32" />;
      },
    },
    {
      title: "Buyer Purchase Limit",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <CustomSelect />;
      },
    },
    {
      title: "Action",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <Button danger onClick={() => handleDeleteProduct(record.id)}>
            Delete
          </Button>
        );
      },
    },
  ];

  // define UI row product discount requirements
  const PrdDiscountReq = () => {
    return (
      <Row gutter={[30, 30]} className="bg-[#f5f5f5] p-10 mt-6">
        <Row>
          <h2>Product discount requirements</h2>
        </Row>

        <Row gutter={[160, 160]}>
          <Col span={24} md={{ span: 12 }}>
            <div className="align-middle">
              <p className="text-sm">The biggest discount takes effect</p>
              <p className="text-xs text-grey-400">
                A product can be included in multiple discount promotions, but
                only the biggest discount will take effect at any given time.
              </p>
            </div>
          </Col>

          <Col span={24} md={{ span: 12 }}>
            <div className="align-middle">
              <p className="text-sm">Flash deal prices are prioritized</p>
              <p className="text-xs text-grey-400">
                When a product has both a product discount and a flash deal
                discount, only the flash deal price will be shown.
              </p>
            </div>
          </Col>
        </Row>
      </Row>
    );
  };

  // define UI table product selected on modal
  const TablePrdSelected = () => {
    return (
      <div className="mt-8 pr-2">
        <Table
          rowSelection={rowSelectionTable}
          columns={columnsPrdSelected}
          dataSource={productForm?.length > 0 ? productForm : []}
          loading={loading}
          bordered
          rowKey={(record) => record.key}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="absolute top-[50%] left-[47%]">
        {loading ? <Loading /> : null}
      </div>

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
        <ContentHeader
          title={
            prdDiscountID === "create-prd-discount"
              ? "Tạo product discount"
              : "Cập nhật product discount"
          }
        />
        {/* top */}
        <Row className="p-10 pt-5 justify-between min-h-[465px]">
          {/* left */}
          <Col span={11}>
            <h2 className="my-4">Thông tin cơ bản</h2>
            <Form.Item
              label="Tên chương trình"
              name="name"
              labelAlign="left"
              className="font-medium"
              sx={{ width: "50%" }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên chương trình!",
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
              initialValue={location?.state?.code}
            >
              <Input
                className="w-2/3"
                placeholder="Nhập tên chương trình"
                defaultValue={location?.state?.name}
              />
            </Form.Item>

            <div className="flex align-middle">
              <span className="text-sm font-semibold">
                Promotion period(PST)
              </span>
              <Tooltip
                className="ml-2"
                placement="top"
                title="the maximum promotion period day is 30 days"
              >
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
                      message: "Vui lòng chọn ngày bắt đầu!",
                    },
                  ]}
                  initialValue={
                    location?.state?.start_time
                      ? dayjs(location?.state?.start_time)
                      : ""
                  }
                >
                  <DatePicker
                    format="DD-MM-YYYY HH:mm:ss"
                    onChange={handleChangeStartTime}
                    disabledDate={disabledDate}
                    placeholder="Từ ngày"
                    showTime={{
                      defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                    }}
                    defaultValue={
                      location?.state?.start_time
                        ? dayjs(
                            location?.state?.start_time,
                            "DD/MM/YYYY HH:mm:ss"
                          )
                        : ""
                    }
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
                      message: "Vui lòng chọn ngày kết thúc!",
                    },
                    () => ({
                      validator(_, value) {
                        const validTimePass = validateEndDate(
                          values.start_time,
                          value
                        );
                        if (validTimePass) {
                          return Promise.reject(errorMessage);
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  initialValue={
                    location?.state?.end_time
                      ? dayjs(location?.state?.end_time)
                      : ""
                  }
                >
                  <DatePicker
                    format="DD-MM-YYYY HH:mm:ss"
                    onChange={handleChangeEndTime}
                    disabledDate={disabledDate}
                    placeholder="Đến ngày"
                    showTime={{
                      defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                    }}
                    defaultValue={
                      location?.state?.end_time
                        ? dayjs(location?.state?.end_time)
                        : ""
                    }
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
                  message: "Vui lòng chọn discount type!",
                },
              ]}
              initialValue={discountType}
            >
              <Radio.Group
                options={[
                  { label: "Percentage Off", value: true },
                  { label: "Fixed Price", value: false },
                ]}
                defaultValue={discountType}
                className="font-normal"
                onChange={(e) => setDiscountType(e.target.value)}
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
        <Row className="h-4 bg-[#f5f5f5]"></Row>
        {/* bottom */}
        <div className="p-10 pt-5 ">
          <div>
            <h2>Product</h2>
            <p className="text-gray-400">
              The discount can apply to either specific products or specific
              variations.
            </p>
          </div>

          <div className="mt-6">
            <Form.Item
              label="variations"
              name="variations"
              className="font-medium mb-[11px]"
              labelAlign="left"
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị tối thiểu!",
                },
              ]}
              initialValue={location?.state?.variations}
            >
              <Radio.Group
                options={[
                  { label: "Product-level", value: true },
                  { label: "Variation-level", value: false },
                ]}
                className="font-normal"
                onChange={(e) => setVariations(e.target.value)}
                buttonStyle="solid"
              />
            </Form.Item>
          </div>

          <div className="mt-6">
            <Button type="primary" onClick={showModal}>
              Chọn sản phẩm
            </Button>

            {/* check if has no product selected, show PrdRequiment */}
            {prdSelected.length > 0 ? <TablePrdSelected /> : <PrdDiscountReq />}
          </div>
        </div>
        {/* <div className="w-[300px] ml-auto pr-10">
          <Button
            className="mt-4"
            block
            type="primary"
            htmlType="submit"
            disabled={loading}
            width={200}
          >
            {prdDiscountID === "create-prd-discount" ? "Tạo" : "Cập nhật"}
          </Button>
        </div> */}
      </Form>

      {/* modal */}
      <Modal
        title="Chọn sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="900px"
      >
        {/* top */}
        <Row className="mt-8">
          <Col span={8}>
            <Cascader
              options={categoriesData}
              onChange={handleChangeCategoriesModal}
              placeholder="Please select"
              showSearch={(input, options) => {
                return (
                  options.label.toLowerCase().indexOf(input.toLowerCase()) >=
                    0 ||
                  options.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
            />
          </Col>
          <Col span={16}>
            <Search
              placeholder="Search by product ID or prd name"
              onSearch={onSearchTable}
            />
          </Col>
          <div className="mt-4 ml-auto">
            <p className="text-red-400">
              Lưu ý! : Nếu sản phẩm đang trong 1 chương trình giảm giá khác thì
              sẽ ưu tiên chương trình nào giảm giá cao hơn
            </p>
          </div>
        </Row>

        <div className="mt-8 pr-2">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={products?.length > 0 ? products : []}
            loading={loading}
            bordered
            rowKey={(record) => record.id}
          />
        </div>
      </Modal>
      {contextHolder}
    </div>
  );
}
