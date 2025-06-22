import { useEffect, useState, useRef } from "react";
import "./NotepadApp.css";
function NotepadApp({ componentId }) {
  const [note, setNote] = useState("");
  const isInitialMount = useRef(true);

  useEffect(() => {
    const saved = localStorage.getItem(`note-${componentId}`);
    if (saved !== null) {
      setNote(saved);
    }
  }, [componentId]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      localStorage.setItem(`note-${componentId}`, note);
    }
  }, [note, componentId]);

  return (
    <div style={{ height: "100%" }}>
      <textarea
        type="text"
        className="notepad-textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>
    </div>
  );
}

NotepadApp.appName = "메모장";
NotepadApp.Icon = () => <span style={{ fontSize: "24px" }}>📝</span>;

export default NotepadApp;
