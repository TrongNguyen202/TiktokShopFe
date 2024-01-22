import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Form } from 'antd';

import { removeDuplicates } from '../../utils'
import ProductSectionTitle from './ProuctSectionTitle';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ProductMedia = ({productData, imgBase64}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const mediaData = productData?.images?.map((item) => (
        item?.url_list?.map((image) => ({
            uid: item.id,
            name: productData?.product_name,
            status: 'done',
            url: image
        }))
    ))
    const mediaConcat = mediaData&&[].concat(...mediaData)
    const mediaUpload = mediaConcat&&removeDuplicates(mediaConcat, 'uid')

    useEffect(() => {
        setFileList(mediaUpload)
    }, [productData])
    
    const handleCancel = () => setPreviewOpen(false);
    
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        console.log('newFileList: ', newFileList);
        setFileList(newFileList)
        imgBase64(newFileList)
    }

    return (
        <>
            <ProductSectionTitle title='Ảnh và video' />
            <Form.Item name="images">
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    previewFile={getBase64}
                >
                    {fileList?.length >= 8 ? null : 
                        (<button style={{ border: 0, background: 'none'}} type="button" >
                            <PlusOutlined />
                            <div style={{ marginTop: 8}} > Upload</div>
                        </button>)
                    }
                </Upload>
                {/* <input type='file'/> */}
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt={previewTitle}  style={{ width: '100%', }} src={previewImage} />
                </Modal>
            </Form.Item>
        </>
    );
};
export default ProductMedia;