import { Button, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Image } from 'react-konva';

import { CheckOutlined } from '@ant-design/icons';
import CrewBack from '../../assets/images/crew_back.png';
import CrewFront from '../../assets/images/crew_front.png';
import MensHoodieBack from '../../assets/images/mens_hoodie_back.png';
import MensHoodieFront from '../../assets/images/mens_hoodie_front.png';
import WomensCrewBack from '../../assets/images/womens_crew_back.png';
import WomensCrewFront from '../../assets/images/womens_crew_front.png';
import MensTankBack from '../../assets/images/mens_tank_back.png';
import MensTankFront from '../../assets/images/mens_tank_front.png';
import DefaultImage from '../../assets/images/invisibleman.jpg';
import URLImage from './URLImage';
import { initDesignOptions, recommendColor } from './constant';

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
  console.log('selectedId: ', selectedId);
  const [images, setImages] = useState([]);

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
    switch (type) {
      case 'Short Sleeve Shirt':
        if (isShowBack) return <img style={{ background: color }} src={CrewBack} alt="design" />;
        return <img style={{ background: color }} src={CrewFront} alt="design" />;
      case 'Long Sleeve Shirt':
        if (isShowBack) return <img style={{ background: color }} src={WomensCrewBack} alt="design" />;
        return <img style={{ background: color }} src={WomensCrewFront} alt="design" />;
      case 'Hoodies':
        if (isShowBack) return <img style={{ background: color }} src={MensHoodieBack} alt="design" />;
        return <img style={{ background: color }} src={MensHoodieFront} alt="design" />;
      case 'Tank Tops':
        if (isShowBack) return <img style={{ background: color }} src={MensTankBack} alt="design" />;
        return <img style={{ background: color }} src={MensTankFront} alt="design" />;
      default:
        if (isShowBack) return <img style={{ background: color }} src={CrewBack} alt="design" />;
        return <img style={{ background: color }} src={CrewFront} alt="design" />;
    }
  };

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleUndo = () => {
    if (historyStep === 0) {
      return;
    }
    historyStep -= 1;
    const previous = history[historyStep];
    setImages(previous);
  };

  const handleRedo = () => {
    if (historyStep === history.length - 1) {
      return;
    }
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

  // viết hàm xoá 1 ảnh khỏi canvas
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
    console.log(uri);
    downloadURI(uri, 'stage.png');
  };

  return (
    <div className="flex w-[1000px] mx-auto mt-10">
      <div className="flex flex-1 flex-col gap-5">
        <Select
          style={{ width: '100%' }}
          options={initDesignOptions}
          placeholder="Select a design"
          onChange={(value) => setSelectedDesign(value)}
          defaultValue={initDesignOptions[0].value}
        />
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
        </div>
        <img
          src={DefaultImage}
          alt="default"
          className="w-[100px] h-[100px] object-cover"
          onClick={() => {
            handleImageChange(images[images.length - 1]?.id || 0, {
              id: (images[images.length - 1]?.id || 0) + 1,
              src: DefaultImage,
              x: 50,
              y: 50,
              scaleX: 1,
              scaleY: 1,
            });
          }}
        />
        <div className="flex gap-2">
          <Button type="primary" onClick={() => setIsShowBack(!isShowBack)}>
            {isShowBack ? 'Show Front' : 'Show Back'}
          </Button>
          <Button onClick={handleExport}>Download</Button>
          <Button onClick={handleUndo} disabled={historyStep === 0}>
            Undo
          </Button>
          <Button onClick={handleRedo} disabled={historyStep === history.length - 1}>
            Redo
          </Button>
          <Button onClick={() => handleDeleteImage(selectedId)}>Delete</Button>
        </div>
      </div>
      <div className="relative shrink-0 flex-1 h-[634px] w-[510px]">
        <div className="absolute">{renderImageByType(selectedDesign)}</div>
        <div className=" absolute inset-0">
          <Stage
            width={510}
            height={634}
            ref={stageRef}
            // className="border-[1px] border-solid border-transparent hover:border-gray-600  absolute top-[50%] translate-y-[-50%] left-[52%] translate-x-[-50%]"
            className="border-[1px] border-solid border-transparent hover:border-gray-600  inset-0"
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
          >
            <Layer>
              {images.map((image, i) => (
                <URLImage
                  key={i}
                  imageProps={image}
                  image={image}
                  isSelected={image.id === selectedId}
                  onSelect={() => selectShape(image.id)}
                  onChange={(newAttrs) => handleImageChange(i, newAttrs)}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
