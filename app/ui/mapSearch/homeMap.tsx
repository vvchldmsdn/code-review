'use client'

import { MapType } from "../../lib/definitions";
import { useState, useRef, useCallback } from 'react';

// mapData: page.tsx내에서 지도가 보일 위치와 크기를 결정할 정보를 담고 있습니다.  definitions.ts 참고
export default function HomeMap({ mapData }: { mapData: MapType}) {
  const imgRef = useRef<HTMLImageElement>(null);  // 이미지 엘리먼트 참조용
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);  // 이미지의 크기 (transfrom scale)을 위한 state
  const [dragging, setDragging] = useState<boolean>(false);  // 드래그 중인지 아닌지를 확인하기 위한 state
  const [mapPosition, setMapPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });  // 상위 div태그에 대한 position을 위한 state
  const [mouseStart, setMouseStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });  // 드래그 시작 시 처음 클릭 한 지점의 이미지 내에서의 커서 위치를 위한 state
  const [mapTopLeft, setMapTopLeft] = useState<{ x: number, y: number}>({ x: 0, y: 0 });  // 확대 축소 시 이미지가 div태그 내에 머물게 하기 위한 드래그 limit용 state

  const handleMapClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (imgRef.current.naturalWidth / rect.width);
      const y = (e.clientY - rect.top) * (imgRef.current.naturalHeight / rect.height);
      // console.log(`Image coordinates: (${x}, ${y})`);
    }
  };

  // 이미지 위에서 마우스를 클릭할 시 드래그 중인 것으로 상태를 변경하고 클릭 위치를 저장하는 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    setDragging(true);
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();  // 이미지의 뷰포트 내에서의 상대적 위치
      setMouseStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });  // 커서의 이미지 태그 내에서의 상대적 위치
    }
  };

  // 클릭하고 드래그 할 시 이미지의 포지션을 업데이트하기 위한 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (dragging && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const [rw, rh] = [Math.floor(rect.width), Math.floor(rect.height)];
      let newX: number;
      let newY: number;

      // (e.clientX - rect.left - mouseStart.x) 는 처음 클릭 위치로부터의 방향과 거리를 담고있는 정보입니다. 여기에 + mapPosition.x를 하면
      // 지도의 포지션을 마우스가 이동한 방향과 거리만큼 업데이트 한 정보가 됩니다.
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

  //  드래그가 끝나고 마우스 왼쪽 클릭한 상태가 끝나면 드래그를 하지 않는 상태로 바꿔주기 위한 state
  const handleMouseUp = () => {
    setDragging(false);
  };

  //  지도를 확대할 때 지도의 포지션, 지도의 드래그 limit을 업데이트 하는 이벤트 핸들러
  //  확대 시 이미지 태그의 상위 div태그내에서의 상대적 위치가 변경되지만 mapPosition state는 변경되지 않아 문제가 발생합니다.
  //  이를 해결하기 위한 장치라고 이해해주시면 감사하겠습니다.
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

  //  지도를 축소할 때 지도의 포지션, 지도가 이상한 위치로 축소되어 div태그 밖으로 벗어나지 않게 하기 위해 드래그 limit 업데이트 이벤트 핸들러
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