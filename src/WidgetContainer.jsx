import React, { useState, useEffect, useRef } from "react";
import "./Sidepanel.css";

import { useTheme } from "./Context.jsx";

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

  const { themeColor, textColor, titleBarColor } = useTheme();

  const isFirstRender = useRef(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const newX = Math.min(
          Math.max(e.clientX - offset.x, 0),
          window.innerWidth - width
        );
        const newY = Math.min(
          Math.max(e.clientY - offset.y, 0),
          window.innerHeight - height
        );
        onDrag(id, newX, newY);
      }
      if (resizing) {
        const newWidth = Math.max(
          200,
          startSize.width + (e.clientX - startPos.x)
        );
        const newHeight = Math.max(
          150,
          startSize.height + (e.clientY - startPos.y)
        );
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

  useEffect(() => {
    isFirstRender.current = true;
  }, []);
  useEffect(() => {
    if (isFirstRender.current) isFirstRender.current = false;
    else if (!dragging && !resizing) onMouseUp(); //위치 크기 변경시 저장
  }, [dragging, resizing]);

  return (
    <div
      className="draggable-window"
      style={{ left: x, top: y, width, height, zIndex }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className="title-bar"
        style={{ backgroundColor: titleBarColor }}
        onMouseDown={(e) => {
          setDragging(true);
          setOffset({ x: e.clientX - x, y: e.clientY - y });
        }}
      >
        <span>{title}</span>
        <button onClick={() => onClose(id)}>×</button>
      </div>
      <div
        className="window-content"
        style={{ backgroundColor: themeColor, color: textColor }}
      >
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
