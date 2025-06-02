import React, { useState, useEffect } from "react";
import "./Sidepanel.css";

export default function Window({
  id,
  x,
  y,
  width,
  height,
  zIndex,
  title,
  children,
  onDrag,
  onResize,
  onFocus,
  onClose,
  onMouseUp,
}) {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width, height });
  const [startPos, setStartPos] = useState({ x, y });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        onDrag(id, e.clientX - offset.x, e.clientY - offset.y);
      }
      if (resizing) {
        const newWidth = Math.max(200, startSize.width + (e.clientX - startPos.x));
        const newHeight = Math.max(150, startSize.height + (e.clientY - startPos.y));
        onResize(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, offset, startPos, startSize]);

  useEffect(() => {if(!dragging && !resizing)onMouseUp(); //위치 크기 변경시 저장
    }, [dragging, resizing])

  return (
    <div
      className="draggable-window"
      style={{ left: x, top: y, width, height, zIndex }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className="title-bar"
        onMouseDown={(e) => {
          setDragging(true);
          setOffset({ x: e.clientX - x, y: e.clientY - y });
        }}
      >
        <span>{title}</span>
        <button onClick={() => onClose(id)}>×</button>
      </div>
      <div className="window-content">
        {children}
      </div>
      <div
        className="resizer"
        onMouseDown={(e) => {
          setResizing(true);
          setStartSize({ width, height });
          setStartPos({ x: e.clientX, y: e.clientY });
        }}
      />
    </div>
  );
}