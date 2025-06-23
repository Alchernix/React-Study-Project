import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import "./Sidepanel.css";
import "./RoundWindow.css";

import { useTheme } from "./Context.jsx";

export default function RoundWindow({
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
  const { themeColor, textColor, titleBarColor } = useTheme();
  const [moving, setMoving] = useState(false);
  const [sizing, setSizing] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
    } else if (!moving && !sizing) {
      onMouseUp();
    }
  }, [moving, sizing, onMouseUp]);

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      onDragStart={() => {
        onFocus(id);
        setMoving(true);
      }}
      onDragStop={(e, d) => {
        onDrag(id, d.x, d.y);
        setMoving(false);
      }}
      onResizeStart={() => setSizing(true)}
      onResizeStop={(e, dir, ref, delta, position) => {
        onResize(id, ref.offsetWidth, ref.offsetHeight);
        onDrag(id, position.x, position.y);
        setSizing(false);
      }}
      bounds="window"
      minWidth={200}
      minHeight={150}
      className="rwidget-container"
      style={{ zIndex, backgroundColor: themeColor, color: textColor }}
    >
      <button className="rwindow-close-btn" onClick={() => onClose(id)}>
        <i className="fa-solid fa-xmark"></i>
      </button>
      <div
        className="rwidget-content"
        style={{ backgroundColor: themeColor, color: textColor }}
      >
        {children}
      </div>
    </Rnd>
  );
}
