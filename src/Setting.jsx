import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import "./Setting.css";
import { useTheme } from "./Context";

Modal.setAppElement("#root");

export default function Setting({ isOpen, onClose }) {
  const { setThemeColor } = useTheme();

  function changeBgColor(color) {
    document.body.style.backgroundColor = color;
    localStorage.setItem(`bgColor`, color);
  }

  function changeThemeColor(color) {
    setThemeColor(color);
    localStorage.setItem(`themeColor`, color);
  }

  useEffect(() => {
    const savedBgColor = localStorage.getItem(`bgColor`);
    const savedThemeColor = localStorage.getItem(`themeColor`);
    if (savedBgColor !== null) {
      changeBgColor(savedBgColor);
    }
    if (savedThemeColor !== null) {
      setThemeColor(savedThemeColor);
    }
  }, []);

  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={onClose}>
        <div className="setting-inner1">
          <h2>설정</h2>
          <button className="setting-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="setting-inner">
          <div className="setting-category">보드 테마색</div>
          <div className="palette-container">
            <div
              className="palette"
              style={{ backgroundColor: "#3a86ff" }}
              onClick={() => changeBgColor("#3a86ff")}
            ></div>
            <div
              className="palette"
              style={{ backgroundColor: "#8338ec" }}
              onClick={() => changeBgColor("#8338ec")}
            ></div>
            <div
              className="palette"
              style={{ backgroundColor: "#ff006e" }}
              onClick={() => changeBgColor("#ff006e")}
            ></div>
            <div
              className="palette"
              style={{ backgroundColor: "#fb5607" }}
              onClick={() => changeBgColor("#fb5607")}
            ></div>
            <div
              className="palette"
              style={{ backgroundColor: "#ffbe0b" }}
              onClick={() => changeBgColor("#ffbe0b")}
            ></div>
            <div
              className="palette"
              style={{ backgroundColor: "#ffffff", border: "1px solid #ddd" }}
              onClick={() => changeBgColor("#ffffff")}
            ></div>
            <div
              className="palette"
              style={{ backgroundColor: "#171717" }}
              onClick={() => changeBgColor("#171717")}
            ></div>
          </div>
        </div>
        <div className="setting-inner">
          <div className="setting-category">위젯 테마색</div>
          <div className="palette-container">
            <div
              className="palette"
              style={{ backgroundColor: "#ffffff", border: "1px solid #ddd" }}
              onClick={() => changeThemeColor("#ffffff")}
            ></div>
            <div
              className="palette"
              style={{ backgroundColor: "#2b2d42" }}
              onClick={() => changeThemeColor("#2b2d42")}
            ></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
