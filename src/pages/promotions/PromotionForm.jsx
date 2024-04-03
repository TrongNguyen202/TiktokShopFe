import { message } from 'antd';
import { useNavigate } from "react-router-dom";

import dayjs from 'dayjs';
import { getPathByIndex } from '../../utils';
import { usePromotionsStore } from '../../store/promotionsStore';

import PromotionCreateForm from '../../components/promotion/PromotionCreateForm';

export default function PromotionForm() {
  const navigate = useNavigate();
  const initialData = {
    title: 'Discount',
    begin_time: dayjs().add(2, 'm'),
    end_time: dayjs().add(2, 'm').add(30, 'd'),
    type: 'DirectDiscount',
    discount: '15',
    product_type: 'SPU',
  };

  const { createPromotion, loading } = usePromotionsStore((state) => state);

  const onSubmit = (dataForm, productSelected ) => {
    const shopId = getPathByIndex(2);
    const onSuccess = (res) => {
      message.success(`Tạo promotion ${dataForm?.title}  thành công`);
      navigate(`/shops/${shopId}/promotions`);
    };
    const onFail = (err) => {
      message.error(`Tạo promotion thất bại. ${err}`);
    };

    let submitData = {
      ...dataForm,
      title: `Discount ${dataForm.title}`,
      begin_time: dataForm.begin_time.unix(),
      end_time: dataForm.end_time.unix(),
      product_list: productSelected.map(item => ({
        product_id: item.id,
        num_limit: -1, 
        user_limit: -1,
        discount: dataForm.discount
      }))
    };

    delete submitData.discount;

    // console.log('submitData: ', submitData);

    createPromotion(shopId, submitData, onSuccess, onFail);
  };

  return (
    <PromotionCreateForm initialData={initialData} loading={loading} onSubmit={onSubmit} />
  );
}