import React, { useState} from "react";
import NotepadApp from "./apps/NotepadApp";
import "./Sidepanel.css";

export default function SidePanelApp({openApp}) {
  
  const [panelOpen, setPanelOpen] = useState(false);

  
  const apps = [NotepadApp];

  return (
    <div>
    <div
        className="left-trigger"
        onMouseOver={() => setPanelOpen(true)}
      />
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
      </div>
  );
}

