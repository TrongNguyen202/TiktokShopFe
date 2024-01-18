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
const ProductCreateMedia = ({productData, imgBase64}) => {
    // console.log('productData: ', productData);
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
        const newImg = newFileList&&newFileList.filter(item => item?.originFileObj)
        const newImgList = newImg&&newImg.map(item => item?.thumbUrl && item?.thumbUrl)
        console.log('newFileList:', newFileList)
        console.log('newImgList', newImgList)
        setFileList(newFileList)
        imgBase64(newFileList)
    }

    return (
        <>
            <ProductSectionTitle title='Ảnh và video' />
            <Form.Item name="images">
                <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    <button style={{ border: 0, background: 'none'}} type="button" >
                        <PlusOutlined />
                        <div style={{ marginTop: 8}} > Upload</div>
                    </button>
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example"  style={{ width: '100%', }} src={previewImage} />
                </Modal>
            </Form.Item>
        </>
    );
};
export default ProductCreateMedia;