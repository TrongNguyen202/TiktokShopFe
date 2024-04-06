import { message } from 'antd';
import { useNavigate } from "react-router-dom";

import dayjs from 'dayjs';
import { getPathByIndex } from '../../utils';
import { usePromotionsStore } from '../../store/promotionsStore';

import PromotionCreateForm from '../../components/promotion/PromotionCreateForm';

function FlashDealForm() {
  const navigate = useNavigate();
  const initialData = {
    title: 'Flashdeal',
    begin_time: dayjs().add(2, 'm'),
    end_time: dayjs().add(2, 'm').add(3, 'd'),
    type: 'FlashSale',
    discount: '15',
    product_type: 'SKU',
  };

  const { createFlashDeal, loading } = usePromotionsStore((state) => state);

  const onSubmit = (dataForm, productSelected) => {
    const onSuccess = () => {
      message.success(`Tạo promotion ${dataForm?.title}  thành công`);
      navigate(`/shops/${shopId}/promotions`);
    };
    const onFail = (err) => {
      message.error(`Tạo promotion thất bại. ${err}`);
    };

    const shopId = getPathByIndex(2);
    let submitData = {
      ...dataForm,
      title: `Flashdeal ${dataForm.title}`,
      begin_time: dataForm.begin_time.unix(),
      end_time: dataForm.end_time.unix(),
      product_list: productSelected.map(item => ({
        product_id: item.id,
        num_limit: -1, 
        user_limit: -1,
        sku_list: item.skus.map((sku) => {
          const promotion_price = Number(sku.price.original_price) - Number(dataForm.discount) * (Number(sku.price.original_price)/100);
          return ({
            product_id: item.id,
            sku_id: sku.id,
            promotion_price: promotion_price.toString(),
            num_limit: -1,
            user_limit: 10
          })
        })
      }))
    };

    delete submitData.discount;

    createFlashDeal(shopId, submitData, onSuccess, onFail);
  };

  return (
    <div>
      <PromotionCreateForm initialData={initialData} loading={loading} onSubmit={onSubmit} />
    </div>
  );
}

export default FlashDealForm;
