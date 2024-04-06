import { Button, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

import {
  CheckOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  RetweetOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import CrewBack from '../../assets/images/crew_back.png';
import CrewFront from '../../assets/images/crew_front.png';
import DefaultImage from '../../assets/images/invisibleman.jpg';
import MensHoodieBack from '../../assets/images/mens_hoodie_back.png';
import MensHoodieFront from '../../assets/images/mens_hoodie_front.png';
import MensTankBack from '../../assets/images/mens_tank_back.png';
import MensTankFront from '../../assets/images/mens_tank_front.png';
import WomensCrewBack from '../../assets/images/womens_crew_back.png';
import WomensCrewFront from '../../assets/images/womens_crew_front.png';
import LongSleeveShirtFront from '../../assets/images/mens_longsleeve_front.png';
import LongSleeveShirtBack from '../../assets/images/mens_longsleeve_back.png';
import ImageBase from './ImageBase';
import URLImage from './URLImage';
import { initDesignOptions, recommendColor } from './constant';
import { RedoIcon, UndoIcon } from '../../assets/icons';

let history = [];
let historyStep = 0;

function downloadURI(uri, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
  }, 0);
}

export default function DesignEditor() {
  const [selectedDesign, setSelectedDesign] = useState(initDesignOptions[0].value);
  const [isShowBack, setIsShowBack] = useState(false);
  const [color, setColor] = useState('#0067A3');
  const [selectedId, selectShape] = useState(null);
  const [images, setImages] = useState([]);
  const [imageBase, setImageBase] = useState();

  const stageRef = React.useRef(null);

  useEffect(() => {
    history = [images];
    historyStep = 0;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        handleUndo();
      }
      if (event.ctrlKey && event.key === 'y') {
        handleRedo();
      }
      if (event.key === 'Backspace') {
        handleDeleteImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);

  const renderImageByType = (type) => {
    if (imageBase) return null;
    const image = {
      x: 0,
      y: 0,
      width: 510,
      height: 634,
      src: DefaultImage,
      scaleX: 1,
    };
    switch (type) {
      case 'Short Sleeve Shirt':
        if (isShowBack) image.src = CrewBack;
        else image.src = CrewFront;
        break;
      case 'Long Sleeve Shirt':
        if (isShowBack) image.src = LongSleeveShirtBack;
        else image.src = LongSleeveShirtFront;
        break;
      case 'Hoodies':
        if (isShowBack) image.src = MensHoodieBack;
        else image.src = MensHoodieFront;
        break;
      case 'Tank Tops':
        if (isShowBack) image.src = MensTankBack;
        else image.src = MensTankFront;
        break;
      default:
        if (isShowBack) image.src = CrewBack;
        else image.src = CrewFront;
        break;
    }

    return (
      <ImageBase
        imageProps={image}
        image={image}
        color={color}
        checkDeselect={checkDeselect}
        onSelect={checkDeselect}
      />
    );
  };

  const checkDeselect = (e, value) => {
    if (!value) {
      selectShape(null);
      return null;
    }
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleUndo = () => {
    if (historyStep === 0) return;
    historyStep -= 1;
    const previous = history[historyStep];
    setImages(previous);
  };

  const handleRedo = () => {
    if (historyStep === history.length - 1) return;
    historyStep += 1;
    const next = history[historyStep];
    setImages(next);
  };

  const handleImageChange = (i, newImages) => {
    const imgs = images.slice();
    imgs[i] = newImages;
    history = history.slice(0, historyStep + 1);
    history = history.concat([imgs]);
    historyStep += 1;
    setImages(imgs);
  };

  const handleDeleteImage = () => {
    if (!selectedId) return;
    const imgs = images.slice();
    const newImgs = imgs.filter((img) => img.id !== selectedId);
    history = history.slice(0, historyStep + 1);
    history = history.concat([newImgs]);
    historyStep += 1;
    setImages(newImgs);
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    downloadURI(uri, 'stage.png');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const newWidth = 100;
          const scaleFactor = newWidth / img.width;
          const newHeight = img.height * scaleFactor;
          const newImage = {
            id: new Date().getTime(),
            src: img.src,
            x: 100,
            y: 100,
            scaleX: 1,
            scaleY: 1,
            width: newWidth,
            height: newHeight,
          };
          if (imageBase) setImages([...images, newImage]);
          else setImages([newImage]);
        };
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleAddImageBase = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const newWidth = 500;
          const scaleFactor = newWidth / img.width;
          const newHeight = img.height * scaleFactor;
          const newImage = {
            id: images.length,
            src: img.src,
            x: 0,
            y: 50,
            scaleX: 1,
            scaleY: 1,
            width: newWidth,
            height: newHeight,
          };
          setImages([newImage]);
          setImageBase(newImage);
        };
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="flex w-[1000px] mx-auto mt-20">
      <div className="flex flex-1 flex-col gap-5">
        <div className="pr-5">
          <Select
            style={{ width: '100%' }}
            options={initDesignOptions}
            placeholder="Select a design"
            onChange={(value) => {
              setSelectedDesign(value);
              if (imageBase) {
                setImageBase(null);
                setImages([]);
              }
            }}
            defaultValue={initDesignOptions[0].value}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {recommendColor.map((item) => {
            return (
              <div
                key={item}
                className="w-8 h-8 rounded-full cursor-pointer relative"
                style={{ backgroundColor: item }}
                onClick={() => setColor(item)}
              >
                {color === item && (
                  <div className="absolute w-4 h-4 top-[40%] translate-x-[-50%] left-[52%] translate-y-[-50%]">
                    <CheckOutlined className="text-white" />
                  </div>
                )}
              </div>
            );
          })}
          <p className="text-red-500 italic">
            {imageBase && 'Note: Only images with a transparent background can change color.'}
          </p>
          <p />
        </div>
        <Button onClick={handleAddImageBase} icon={<CloudUploadOutlined />} className="w-fit">
          Upload base image
        </Button>
      </div>
      <div className="relative shrink-0 flex-1 h-[630px] w-[510px]">
        <div className="flex gap-1 flex-wrap justify-end absolute top-[-36px] w-[510px]">
          <Tooltip title="Download">
            <Button type="primary" onClick={handleExport} icon={<DownloadOutlined />} />
          </Tooltip>
          <Tooltip title={isShowBack ? 'Show Front' : 'Show Back'}>
            <Button onClick={() => setIsShowBack(!isShowBack)} disabled={imageBase} icon={<RetweetOutlined />} />
          </Tooltip>
          <Tooltip title="Upload design">
            <Button onClick={handleImport} icon={<UploadOutlined />} />
          </Tooltip>
          <Tooltip title="Undo">
            <Button onClick={handleUndo} disabled={historyStep === 0} icon={<UndoIcon />} />
          </Tooltip>
          <Tooltip title="Redo">
            <Button onClick={handleRedo} disabled={historyStep === history.length - 1} icon={<RedoIcon />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button onClick={() => handleDeleteImage(selectedId)} icon={<DeleteOutlined />} disabled={!selectedId} />
          </Tooltip>
        </div>
        <div className=" absolute inset-0">
          <Stage
            width={510}
            height={630}
            ref={stageRef}
            className="border-[1px] w-[513px] border-solid border-gray-200 hover:border-gray-500  inset-0"
          >
            <Layer>
              {renderImageByType(selectedDesign)}
              {images.map((image, i) => (
                <URLImage
                  key={i}
                  imageProps={image}
                  image={image}
                  isSelected={image.id === selectedId}
                  onSelect={(value) => selectShape(value)}
                  onChange={(newAttrs) => handleImageChange(i, newAttrs)}
                  checkDeselect={checkDeselect}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
