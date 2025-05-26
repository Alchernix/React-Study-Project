import React from "react";

function NotepadApp() {
  return (
    <div style={{ padding: "20px", fontSize: "18px" }}>
      <h2>📝 Notepad</h2>
      <p>여기에 메모 내용이 표시될 예정입니다.</p>
    </div>
  );
}

NotepadApp.appName = "메모장";
NotepadApp.Icon = () => <span style={{ fontSize: "24px" }}>📝</span>;

export default NotepadApp;