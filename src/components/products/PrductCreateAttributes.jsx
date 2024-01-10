
import { useState } from 'react';
import { Button, Checkbox, Image, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { getCurrencySymbol, DeleteDuplicateElements } from '../../utils'
import ProductSectionTitle from './ProuctSectionTitle';

const PrductCreateAttributes = ({attributes}) => {
    console.log('attributes: ', attributes)
    const listAttributesData = attributes?.map((item) => item.sales_attributes)
    const listAttributesConvert = listAttributesData&&[].concat(...listAttributesData)
    const listAttributes = listAttributesConvert&&DeleteDuplicateElements(listAttributesConvert)

    return (
        <>
            <ProductSectionTitle title='Thuộc tính' />
            <Button type="link" className='p-0 mb-3' onClick={() => {}}>
                <PlusOutlined />
                {attributes?.length > 1 ? 'Thêm thuộc tính khác' : 'Thêm thuộc tính'}
            </Button>

            {attributes?.length > 1 &&
                <>
                    {listAttributes?.map((attr) => (
                        <>
                            <h4 className='mb-5'>{attr.name}</h4>
                            <ul>
                                {attributes?.map((item) => (
                                    <>
                                        {item.sales_attributes[0].id === attr.id &&
                                            <li className='border-solid border-0 border-t border-[#d9d9d9] last:border-b-0 py-5 flex flex-wrap items-center'>
                                                <Checkbox onChange={(e) =>handleSelect(e)} value={item.id} />
                                                <div className='ml-3 border-[1px] border-dashed border-[#d9d9d9] p-2 rounded-md'>
                                                    <Image src={item.sales_attributes[0]?.sku_img?.url_list[0]} width={100} />
                                                </div>
                                                <h4 className='ml-3 flex-1'>{item.sales_attributes[0].value_name}</h4>
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
                            </ul>
                        </>
                    ))}
                </>
            }
        </>
    );
}
 
export default PrductCreateAttributes;