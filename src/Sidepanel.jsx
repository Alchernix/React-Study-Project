import React, { useState, useEffect } from "react";
import NotepadApp from "./apps/NotepadApp";
import "./Sidepanel.css";

let windowIdCounter = 0;

export default function Board(){
  const [windows, setWindows] = useState([]);
  const openApp = (AppComponent) => {
    const id = `win-${windowIdCounter++}`;
    // 새로 생성되는 윈도우의 default 상태
    const newWindow = {
      id,
      component: AppComponent,
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
      width: 400,
      height: 300,
      zIndex: windows.length + 1,
    };
    setWindows((prev) => [...prev, newWindow]);
  };

  const bringToFront = (id) => {
    const maxZ = Math.max(...windows.map((w) => w.zIndex));
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1 } : w))
    );
  };

  const moveWindow = (id, newX, newY) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x: newX, y: newY } : w))
    );
  };

  const resizeWindow = (id, newWidth, newHeight) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, width: newWidth, height: newHeight } : w
      )
    );
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  return(
        <div className="app-bg">
      <div
        className="left-trigger"
        onMouseOver={() => setPanelOpen(true)}
      />

      <SidePanelApp openApp={openApp}/>

      {windows.map((win) => {
        const AppComponent = win.component;
        return (
          <Window
            key={win.id}
            id={win.id}
            x={win.x}
            y={win.y}
            width={win.width}
            height={win.height}
            zIndex={win.zIndex}
            title={AppComponent.appName}
            onDrag={moveWindow}
            onResize={resizeWindow}
            onFocus={bringToFront}
            onClose={closeWindow}
          >
            <AppComponent />
          </Window>
        );
      })}
    </div>
  )
}

function SidePanelApp(openApp) {
  
  const [panelOpen, setPanelOpen] = useState(false);

  
  const apps = [NotepadApp];

  return (
    <div
        className={`side-panel${panelOpen ? " open" : ""}`}
        onMouseLeave={() => setPanelOpen(false)}
      >
        <div className="side-panel-content">
          <div className="apps-title">앱 목록</div>
          {apps.map((AppComponent, idx) => (
            <button
              key={idx}
              className="app-button"
              onClick={() => openApp(AppComponent)}
            >
              <AppComponent.Icon />
              <span>{AppComponent.appName}</span>
            </button>
          ))}
        </div>
        <div className="panel-footer">
          <button className="footer-button">🪟 창 관리</button>
          <button className="footer-button">⚙️ 설정</button> 
        </div>
      </div>
  );
}

function Window({
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