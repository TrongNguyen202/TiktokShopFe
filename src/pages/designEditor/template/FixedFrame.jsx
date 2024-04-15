import React, { useEffect } from 'react';
import { Layer, Rect, Transformer } from 'react-konva';

export default function FixedFrame({ selectedId, selectShape, fixedFrameInfo, setFixedFrameInfo }) {
  const boxRef = React.useRef(null);
  const transformerRef = React.useRef(null);

  useEffect(() => {
    if (selectedId === 'box') {
      transformerRef.current.nodes([boxRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);
  return (
    <Layer>
      <Rect
        ref={boxRef}
        {...fixedFrameInfo}
        fill="transparent"
        draggable
        stroke="#000" // color of the border
        strokeWidth={1}
        onClick={() => selectShape('box')}
        onTap={() => selectShape('box')}
        onDragEnd={() => {
          const node = boxRef.current;
          setFixedFrameInfo({
            x: node.x(),
            y: node.y(),
            width: node.width(),
            height: node.height(),
            rotation: node.rotation(),
          });
        }}
        onTransformEnd={() => {
          const node = boxRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          setFixedFrameInfo({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {selectedId === 'box' && (
        <Transformer
          ref={transformerRef}
          // enabledAnchors={['top-center', 'bottom-center']}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Layer>
  );
}
