import { useState, useRef, useContext } from "react";
//import { Rnd } from "react-rnd";
import "./WidgetContainer.css";

// 각 노트 객체 형식...
const widget = {
  id: 1,
  type: "text",
  style: { top: "50px", left: "50px", zIndex: 1 },
};

const widget2 = {
  id: 2,
  type: "image",
  style: { top: "200px", left: "200px", zIndex: 2 },
};

// 타입과 컴포넌트 연결
const widgets = {
  text: Text(),
  image: Image(),
};

import { Rnd } from "react-rnd";

export default function WidgetContainer({
  widget,
  updateWidgetStyle,
  getNextZIndex,
}) {
  const { top, left, width = 300, height = 300, zIndex = 1 } = widget.style;
  const content = widgets[widget.type];
  return (
    <Rnd
      className="widget-container"
      // 초기 위치/크기
      default={{
        x: parseInt(left, 10),
        y: parseInt(top, 10),
        width,
        height,
      }}
      // 바운드(창 밖으로 못 나가게)
      bounds="window"
      // 드래그 시작 시 z-index 업데이트
      onDragStart={() => {
        const nextZ = getNextZIndex();
        updateWidgetStyle(widget.id, { ...widget.style, zIndex: nextZ });
      }}
      // 드래그 끝난 후 최종 위치 저장
      onDragStop={(e, d) => {
        updateWidgetStyle(widget.id, {
          ...widget.style,
          top: `${d.y}px`,
          left: `${d.x}px`,
        });
      }}
      // 리사이즈 끝난 후 최종 크기+위치 저장
      onResizeStop={(e, direction, ref, delta, position) => {
        updateWidgetStyle(widget.id, {
          ...widget.style,
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
          top: `${position.y}px`,
          left: `${position.x}px`,
        });
      }}
      style={{ zIndex }}
    >
      <div className="widget-content">{content}</div>
    </Rnd>
  );
}
// 테스트용 위젯들 - 나중에는 각 파일에서 관리예정
function Text() {
  return <div>This is text widget!</div>;
}

function Image() {
  return <img src="#"></img>;
}

export { widget, widget2 }; // 테스트용
