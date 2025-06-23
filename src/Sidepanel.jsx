import React, { useState } from "react";
import NotepadApp from "./apps/NotepadApp";
import WeatherApp from "./apps/WeatherApp";
import YouTubeApp from "./apps/YouTubeApp";
import ToDoListApp from "./apps/ToDoListApp";
import LifeQuotesApp from "./apps/LifeQuotesApp";

import Setting from "./Setting";
import WinCtrl from "./WinCtrl";
import "./Sidepanel.css";

export default function SidePanelApp({ openApp, windows, setWindows }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false); // 설정창 상태변수
  const [isWinCtrlOpen, setIsWinCtrlOpen] = useState(false)

  const apps = [
    "NotepadApp",
    "WeatherApp",
    "YouTubeApp",
    "ToDoListApp",
    "LifeQuotesApp",
  ];
  const apps_map = {
    NotepadApp: NotepadApp,
    WeatherApp: WeatherApp,
    YouTubeApp: YouTubeApp,
    ToDoListApp: ToDoListApp,
    LifeQuotesApp: LifeQuotesApp,
  };

  const sidebarZINdex = Math.max(...windows.map((w) => w.zIndex)) + 1;
  return (
    <div>
      <div
        className={`left-trigger ${panelOpen ? "none" : ""}`}
        onMouseOver={() => setPanelOpen(true)}
      />
      <div
        style={{ zIndex: sidebarZINdex }}
        className={`side-panel${panelOpen ? " open" : ""}`}
        onMouseLeave={() => setPanelOpen(false)}
      >
        <div className="side-panel-content">
          <div className="apps-title">앱 목록</div>
          {apps.map((app, idx) => {
            const AppComponent = apps_map[app];
            return (
              <button
                key={idx}
                className="app-button"
                onClick={() => openApp(app)}
              >
                <AppComponent.Icon />
                <span>{AppComponent.appName}</span>
              </button>
            );
          })}
        </div>
        <div className="panel-footer">
          <button className="footer-button" onClick={() => setIsWinCtrlOpen(true)}>🪟 창 관리</button>
          <button
            className="footer-button"
            onClick={() => setIsSettingOpen(true)}
          >
            ⚙️ 설정
          </button>
        </div>

        {isWinCtrlOpen?<WinCtrl windows={windows} apply={setWindows}></WinCtrl>:<></>}

        <Setting
          isOpen={isSettingOpen}
          onClose={() => {
            setIsSettingOpen(false);
            setPanelOpen(false);
          }}
          zIndex={sidebarZINdex}
        />
      </div>
    </div>
  );
}
