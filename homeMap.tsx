'use client'

import { MapType } from "../../lib/definitions";
import { useState, useRef, useCallback } from 'react';

export default function HomeMap({ mapData }: { mapData: MapType}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [dragging, setDragging] = useState<boolean>(false);
  const [mapPosition, setMapPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [mouseStart, setMouseStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [mapTopLeft, setMapTopLeft] = useState<{ x: number, y: number}>({ x: 0, y: 0 });

  const handleMapClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (imgRef.current.naturalWidth / rect.width);
      const y = (e.clientY - rect.top) * (imgRef.current.naturalHeight / rect.height);
      // console.log(`Image coordinates: (${x}, ${y})`);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    setDragging(true);
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      setMouseStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (dragging && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const [rw, rh] = [Math.floor(rect.width), Math.floor(rect.height)];
      let newX: number;
      let newY: number;

      if (mapPosition.x + (e.clientX - rect.left - mouseStart.x) > mapTopLeft.x) {
        newX = mapTopLeft.x;
      } else if (mapPosition.x + (e.clientX - rect.left - mouseStart.x) < mapTopLeft.x -(rw - mapData.width)) {
        newX = mapTopLeft.x -(rw - mapData.width);
      } else {
        newX = mapPosition.x + (e.clientX - rect.left - mouseStart.x);
      }

      if (mapPosition.y + (e.clientY - rect.top - mouseStart.y) > mapTopLeft.y) {
        newY = mapTopLeft.y;
      } else if (mapPosition.y + (e.clientY - rect.top - mouseStart.y) < mapTopLeft.y -(rh - mapData.height)) {
        newY = mapTopLeft.y -(rh - mapData.height)
      } else {
        newY = mapPosition.y + (e.clientY - rect.top - mouseStart.y);
      }

      setMapPosition({ x: newX, y: newY });
    }
  }


  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleZoomIn = () => {
    if (scale < 5 && imgRef.current) {
      const newScale: number = scale + 0.5;
      const rect = imgRef.current.getBoundingClientRect();
      const imageCenter: Array<number> = [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2];
      const [newRectLeft, newRectTop] = [
        imageCenter[0] - (imageCenter[0] - rect.left) * (newScale / scale)
      , imageCenter[1] - (imageCenter[1] - rect.top) * (newScale / scale)]
      setMapTopLeft({ x: mapPosition.x + mapData.left - newRectLeft, y: mapPosition.y + mapData.top - newRectTop });
      setScale(prev => prev + 0.5);
    }
  };

  const handleZoomOut = () => {
    if (scale > 1 && imgRef.current) {
      const newScale = scale - 0.5;
      const ratio = newScale / scale;
      const rect = imgRef.current.getBoundingClientRect();
      const imageCenter: Array<number> = [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2];
      const newRect = {
        left: imageCenter[0] - (imageCenter[0] - rect.left) * ratio,
        top: imageCenter[1] - (imageCenter[1] - rect.top) * ratio,
        right: (rect.right - imageCenter[0]) * ratio + imageCenter[0],
        bottom: (rect.bottom - imageCenter[1]) * ratio + imageCenter[1]
      };

      let newX = mapPosition.x;
      let newY = mapPosition.y;

      if (newRect.top > mapData.top) {
        newY += mapData.top - newRect.top;
      } else if (newRect.bottom < mapData.top + mapData.height) {
        newY += mapData.top + mapData.height - newRect.bottom;
      }

      if (newRect.left > mapData.left) {
        newX += mapData.left - newRect.left;
      } else if (newRect.right < mapData.left + mapData.width) {
        newX +=  + mapData.left + mapData.width - newRect.right;
      };

      setMapTopLeft({ x: mapPosition.x - newRect.left + mapData.left, y: mapPosition.y + mapData.top - newRect.top });
      setMapPosition({ x: newX, y: newY });
      setScale(newScale);
    }
  };

  const boxStyle = {
    backgroundColor: '#D9D9D9',
    width: mapData.width,
    height: mapData.height,
    left: mapData.left,
    top: mapData.top,
    boxSizing: 'border-box' as 'border-box',
    borderRadius: '20px',
    position: 'absolute' as 'absolute',
    overflow: 'hidden',
  };

  const zoomButtonStyle = {
    position: 'absolute' as 'absolute',
    left: '10px',
    bottom: '10px'
  };

  const mapStyle = {
    objectFit: 'cover' as 'cover',
    width: '100%',
    position: 'absolute' as 'absolute',
    transform: `scale(${scale})`,
    cursor: dragging ? 'move': 'default',
    left: `${mapPosition.x}px`,
    top: `${mapPosition.y}px`
  }

  return (
    <div
      style={boxStyle}
      ref={containerRef}
    >
      <img
        ref={imgRef}
        id="map"
        src="/SoA.jpeg" 
        alt="Home Map Image"
        style={mapStyle}
        onClick={handleMapClick}
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      <div style={zoomButtonStyle}>
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
      </div>
    </div>
  )
}


// 1. 왜 Image 태그로 하면 img태그보다 갑자기 화질이 안좋아지는가
// 2. 왜 축소를 하면 갑자기 이미지가 사라지는가
// 3. 최소 축소 범위를 어떻게 설정할 수 있는가
// 4. 