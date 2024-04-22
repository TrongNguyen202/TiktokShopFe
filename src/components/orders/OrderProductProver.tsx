import { Popover, Tooltip, Image } from 'antd';
import { DownOutlined } from '@ant-design/icons';

function OrderProductProver({ data }) {
  const renderListItemProduct = (record) => {
    return record.data.order_list[0].item_list.map((item) => {
      return (
        <div>
          <div className="flex justify-between items-center gap-3 mt-3 w-[300px]">
            <div className="flex gap-2">
              <div className="flex-1">
                <Image
                  src={item.sku_image}
                  className="w-[26px] h-[26px] object-cover mt-1 flex-1"
                  width={26}
                  height={26}
                />
              </div>
              <div>
                <Tooltip title={item.product_name}>
                  <p className="font-semibold line-clamp-1">{item.product_name}</p>
                </Tooltip>
                <p className="text-[12px] text-gray-500">{item.sku_id}</p>
                <p className="text-[12px] text-gray-500">{item.sku_name}</p>
                <p className="text-[12px] text-gray-500">{item.seller_sku}</p>
              </div>
            </div>
            <p className="font-semibold">x{item.quantity}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <Popover
      content={renderListItemProduct(data)}
      title={`${data.data.order_list[0].item_list.length} sản phẩm`}
      trigger="click"
      placement="bottom"
    >
      <div className="cursor-pointer hover:bg-gray-200 p-2">
        <div className="flex justify-between">
          <p className="text-[13px] font-semibold">{data.data.order_list[0].item_list.length} sản phẩm</p>
          <p>
            <DownOutlined className="text-[12px]" />
          </p>
        </div>
        <div className="-my-[12px] flex gap-1">
          {data.data.order_list[0].item_list.map((item, index) => (
            <div key={index} className=" last:border-b-0 py-1 px-[8px] -mx-[8px] h-[53px] flex flex-wrap items-center">
              <img src={item?.sku_image} className="w-[26px] h-[26px] object-cover" />
            </div>
          ))}
        </div>
      </div>
    </Popover>
  );
}

export default OrderProductProver;
