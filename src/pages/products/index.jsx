import { Button, Table, Tag } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { statusProductTiktokShop } from "../../constants/index";
import { getPathByIndex } from "../../utils";
import { alerts } from "../../utils/alerts";
import { formatDate } from "../../utils/date";
import { IntlNumberFormat } from "../../utils/index";

import { useProductsStore } from "../../store/productsStore";

import PageTitle from "../../components/common/PageTitle";

const Products = () => {
  const navigate = useNavigate();
  const shopId = getPathByIndex(2);
  const { products, getAllProducts } = useProductsStore((state) => state);

  const columnProduct = [
    {
      title: "Mã sản phẩm",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "SKU",
      dataIndex: ["skus", "id"],
      key: "id",
      align: "center",
      render: (_, record) => (
        <div className="-my-[12px]">
          {record?.skus?.map((item, index) => (
            <div
              key={index}
              className="border-solid border-0 border-b border-[#d9d9d9] last:border-b-0 py-1 px-[8px] -mx-[8px] h-[53px] flex flex-wrap items-center justify-center"
            >
              <span className="inline-block break-words">
                {item.seller_sku}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: ["skus", "price"],
      key: "price",
      align: "center",
      render: (_, record) => (
        <div className="-my-[12px]">
          {record?.skus?.map((item, index) => (
            <div
              key={index}
              className="border-solid border-0 border-b border-[#d9d9d9] last:border-b-0 py-1 px-[8px] -mx-[8px] h-[53px] leading-[44px]"
            >
              {IntlNumberFormat(
                item.price.currency,
                "currency",
                3,
                item.price.original_price
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => (
        <>
          {statusProductTiktokShop.map((item, index) => (
            <>
              {text === index && (
                <Tag key={index} color={item.color}>
                  {item.title}
                </Tag>
              )}
            </>
          ))}
        </>
      ),
    },
    {
      title: "Khu vực bán",
      dataIndex: "sale_regions",
      key: "sale_regions",
      align: "center",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "create_time",
      key: "create_time",
      sorter: (a, b) => a.create_time - b.create_time,
      render: (create_time) => (
        <span>{formatDate(create_time * 1000, "DD/MM/YY, h:mm:ss a")}</span>
        // <span>{formatDateTime(create_time)}</span>
      ),
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "update_time",
      key: "update_time",
      sorter: (a, b) => a.update_time - b.update_time,
      render: (update_time) => (
        <span>{formatDate(update_time * 1000, "DD/MM/YY, h:mm:ss a")}</span>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => handleProductEdit(record.id)}>
            Sửa
          </Button>
          <Button
            type="primary"
            onClick={() => handleProductDetail(record.id)}
            className="ml-3"
          >
            Xem
          </Button>
        </>
      ),
    },
  ];

  const hanldeProductCreate = () => {
    navigate(`/shops/${shopId}/products/create`);
  };

  const handleProductEdit = (productId) => {
    navigate(`/shops/${shopId}/products/${productId}/edit`);
  };

  const handleProductDetail = (productId) => {
    navigate(`/shops/${shopId}/products/${productId}`);
  };

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };

    getAllProducts(shopId, onSuccess, onFail);
  }, [shopId]);

  return (
    <div className="p-10">
      <PageTitle title="Danh sách sản phẩm" count={products?.length} showBack />
      <Button
        type="primary"
        onClick={hanldeProductCreate}
        className="mt-5 mb-5 mr-3"
      >
        Thêm sản phẩm
      </Button>
      <Button
        type="primary"
        onClick={() => navigate(`/shops/${shopId}/add-many-products`)}
      >
        Thêm hàng loạt
      </Button>
      <Table
        columns={columnProduct}
        scroll={{ x: 1700, y: 1000 }}
        size="middle"
        bordered
        dataSource={products && products?.length > 0 ? products : []}
      />
    </div>
  );
};

export default Products;
