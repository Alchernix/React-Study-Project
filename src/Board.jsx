import { useState, useRef, useEffect } from "react";

import "./Sidepanel.css";
import SidePanelApp from "./Sidepanel";
import Window from "./WidgetContainer";

import NotepadApp from "./apps/NotepadApp";
import WeatherApp from "./apps/WeatherApp";
import YouTubeApp from "./apps/YouTubeApp";
import ToDoListApp from "./apps/ToDoListApp";
import LifeQuotesApp from "./apps/LifeQuotesApp";

//테스트용
function clean_save() {
  localStorage.removeItem("Board");
}
//clean_save()

const apps_map = {
  NotepadApp: NotepadApp,
  WeatherApp: WeatherApp,
  YouTubeApp: YouTubeApp,
  ToDoListApp: ToDoListApp,
  LifeQuotesApp: LifeQuotesApp,
};

//위젯 위치 저장
function saveWidgets(widgets) {
  localStorage.setItem("Board", JSON.stringify(widgets));
  //  console.log(JSON.parse(localStorage.getItem("Board") || "[]"));
}

//위젯 위치 불러오기
function loadWidgets() {
  return JSON.parse(localStorage.getItem("Board") || "[]");
}

export default function Board() {
  const [windows, setWindows] = useState([]);
  const windowIdCounter = useRef(0);

  //저장 데이터 불러오기
  useEffect(() => {
    const t = loadWidgets();
    if (t.length == 0) {
      windowIdCounter.current = 0;
    } else {
      let id = t.map((item) => Number(item.id.replace(/\D/g, "")));
      windowIdCounter.current = Math.max(...id) + 1;
    }
    setWindows((w) => t);
  }, []);

  //위치/ 크기 변경시 저장용
  const saveEdit = () => {
    saveWidgets(windows);
  };

  const openApp = (appComponent) => {
    const id = `win-${windowIdCounter.current++}`;
    const AppComponent = apps_map[appComponent];
    // 새로 생성되는 윈도우의 default 상태
    const newWindow = {
      id,
      component: appComponent,
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
      width: AppComponent.defaultWidth || 400,
      height: AppComponent.defaultHeight || 300,
      zIndex: Math.max(...windows.map((w) => w.zIndex)) + 1,
    };
    const newWindows = [...windows, newWindow];
    saveWidgets(newWindows); //새 위젯 추가시 저장
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
    const newWindows = windows.filter((w) => w.id !== id);
    saveWidgets(newWindows);
    setWindows((prev) => newWindows);
  };

  return (
    <div className="app-bg">
      <SidePanelApp openApp={openApp} windows={windows} />

      {windows.map((win) => {
        const AppComponent = apps_map[win.component];
        //console.log(AppComponent);
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
            onMouseUp={saveEdit}
          >
            <AppComponent
              componentId={win.id}
              width={win.width}
              height={win.height}
              onResize={(w, h) => resizeWindow(win.id, w, h)}
            />
          </Window>
        );
      })}
    </div>
  );
}
