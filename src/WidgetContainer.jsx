import { useState, useRef, useContext } from "react";
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

export default function WidgetContainer({
  widget,
  updateWidgetStyle,
  getNextZIndex,
}) {
  let isDragging = useRef(false);
  const [position, setPosition] = useState({
    top: parseInt(widget.style.top),
    left: parseInt(widget.style.left),
  });
  const [zIndex, setZIndex] = useState(widget.style.zIndex);
  const offset = useRef({ x: 0, y: 0 });

  const content = widgets[widget.type];

  const handleMouseDown = (e) => {
    isDragging.current = true;
    offset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    setZIndex(getNextZIndex());

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleMouseMove = (e) => {
    let top = e.clientY - offset.current.y;
    let left = e.clientX - offset.current.x;
    top = Math.min(Math.max(top, 0), window.innerHeight - 300); // 고정 너비... 나중에 수정 예정
    left = Math.min(Math.max(left, 0), window.innerWidth - 300);
    if (isDragging.current) {
      setPosition({
        top,
        left,
      });
    }
  };

  const handleMouseUp = (e) => {
    isDragging.current = false;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    updateWidgetStyle(widget.id, {
      top: position.top,
      left: position.left,
      zIndex: zIndex,
    });
  };

  const style = {
    position: "absolute",
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: zIndex,
  };

  return (
    <div
      style={style}
      className="widget-container"
      onPointerDown={handleMouseDown}
      onPointerMove={handleMouseMove}
      onPointerUp={handleMouseUp}
    >
      <div className="widget-content">{content}</div>
    </div>
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
