import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';

import { useTemplateStore } from '../../store/templateStore';
import ModalUploadProduct from '../crawl/ModalUploadProduct';
import ProductList from './ProductList';
import UploadDesign from './UploadDesign';
import DesignTemplate from './template';

export default function DesignEditor() {
  const { designTemplates } = useTemplateStore();
  const [images, setImages] = useState([]);
  const [imagesDesign, setImagesDesign] = useState([]);
  const [imageEdited, setImageEdited] = useState([]);
  const [isShowModalUpload, setShowModalUpload] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    if (checkedItems && checkedItems.length === 0) return;
    // kiểm tra nhưng id của template trong mảng checkedItem có giá trị là true thì set lại giá trị có id đó trong mảng designTemplates vào state imagesDesign
    const newImagesDesign = designTemplates.filter((template) => checkedItems[template.id]);
    setImages(newImagesDesign);
  }, [checkedItems]);

  const onChangeImageDesign = (newImages) => {
    const newImagesDesign = newImages.map((image, i) => ({
      ...image,
      id: i,
    }));
    setImagesDesign(newImagesDesign);
  };

  const handleMergeImages = async () => {
    if (images.length === 0) {
      message.warning('Please choose template!');
      return;
    }
    if (imagesDesign.length === 0) {
      message.warning('Please choose design image!');
      return;
    }
    const newImageEdited = [];
    const handleBeforeMerge = async (imageDesign) => {
      const newImages = [];
      await Promise.all(
        images.map(async (imageInfo, index) => {
          const container = document.createElement('div');
          container.id = `konva-container-${index}`;
          document.body.appendChild(container);
          const newStage = new window.Konva.Stage({
            container: `konva-container-${index}`,
            width: 510,
            height: 510,
          });
          const newLayer = new window.Konva.Layer();
          newStage.add(newLayer);

          const img = new window.Image();
          const { content } = imageInfo;
          img.src = content.src;
          await new Promise((resolve) => {
            img.onload = () => {
              const newImage = new window.Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: 510,
                height: 510,
              });
              newLayer.add(newImage);
              resolve();
            };
          });

          const imgDesign = new window.Image();
          imgDesign.src = imageDesign.src;
          await new Promise((resolve) => {
            imgDesign.onload = () => {
              const newImage = new window.Konva.Image({
                x: content.x,
                y: content.y,
                image: imgDesign,
                width: content.width,
                height: content.height,
                rotation: content.rotation,
              });
              newLayer.add(newImage);
              resolve();
            };
          });

          newLayer.draw();

          const dataURL = newStage.toDataURL();
          const newImg = new window.Image();
          newImages.push({ url: dataURL });
          newImg.src = dataURL;
          // xoá container sau khi merge xong
          document.body.removeChild(container);
        }),
      );
      newImageEdited.push({ images: newImages, id: imageDesign.id });
    };
    await Promise.all(imagesDesign.map(handleBeforeMerge));
    setImageEdited(newImageEdited);
  };

  return (
    <div className="flex flex-col mx-auto p-10">
      <DesignTemplate checkedItems={checkedItems} setCheckedItems={setCheckedItems} />
      <div className="flex flex-1 flex-col gap-5 mr-5">
        {/* <Button onClick={handleAddImageBase} icon={<CloudUploadOutlined />} className="w-[50%]">
          Upload base image
        </Button> */}
        <div>
          <p className="font-semibold text-[16px] mb-1 mt-5">Design images:</p>
          <UploadDesign fileList={imagesDesign} setFileList={onChangeImageDesign} />
        </div>
        <Button className="w-fit" type="primary" ghost onClick={handleMergeImages}>
          Merge Images
        </Button>
        <ProductList imageEdited={imageEdited} />
      </div>
      {isShowModalUpload && (
        <ModalUploadProduct
          isShowModalUpload={isShowModalUpload}
          setShowModalUpload={setShowModalUpload}
          // productList={convertDataProducts(true)}
          imagesLimit={imageEdited}
          // modalErrorInfo={modalErrorInfo}
          // setModalErrorInfo={setModalErrorInfo}
        />
      )}
    </div>
  );
}
