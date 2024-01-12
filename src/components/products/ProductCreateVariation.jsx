
import { useState } from 'react';
import { Button, Checkbox, Image, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { getCurrencySymbol, DeleteDuplicateElements } from '../../utils'
import ProductSectionTitle from './ProuctSectionTitle';

const ProductCreateVariation = ({variation}) => {
    const listAttributesData = variation?.map((item) => item.sales_attributes)
    const listAttributesConvert = listAttributesData&&[].concat(...listAttributesData)
    const listAttributes = listAttributesConvert&&DeleteDuplicateElements(listAttributesConvert)

    return (
        <>
            <ProductSectionTitle title='Biến thể sản phẩm' />
            <Button type="link" className='p-0 mb-3' onClick={() => {}}>
                <PlusOutlined />
                {variation?.length > 1 ? 'Thêm biến thế khác' : 'Thêm biến thể'}
            </Button>

            {variation?.length > 1 &&
                <div>
                    {listAttributes?.map((attr, index) => (
                        <div key={index} className='pt-10 first:pt-0'>
                            <h4 className='mb-2'>{attr.name}</h4>
                            <ul>
                                {variation?.map((item) => (
                                    <>
                                        {item.sales_attributes.map((saleAttr) => (
                                            <>
                                                {saleAttr.id === attr.id && 
                                                    <li className='border-solid border-0 border-t border-[#d9d9d9] last:border-b-0 py-5 flex flex-wrap items-center'>
                                                        <Checkbox onChange={(e) =>handleSelect(e)} value={saleAttr.id} />
                                                        {saleAttr.sku_img &&
                                                            <div className='ml-3 border-[1px] border-dashed border-[#d9d9d9] p-2 rounded-md'>
                                                                <Image src={saleAttr.sku_img?.url_list[0]} width={100} />
                                                            </div>
                                                        }
                                                        <h4 className='ml-3 flex-1'>{saleAttr.value_name}</h4>
                                                        <div className='w-[70px] flex flex-wrap items-center'>
                                                            <Input value={item.price.original_price} className='flex-1 text-center'/>
                                                            <span className='ml-1'>{getCurrencySymbol('USA', item.price.currency)}</span>
                                                        </div>
                                                        <div className='w-[50px] ml-5'>
                                                            <Input value={item.stock_infos[0].available_stock} className='text-center' />
                                                        </div>
                                                    </li>
                                                }
                                            </>
                                        ))}
                                    </>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            }
        </>
    );
}
 
export default ProductCreateVariation;