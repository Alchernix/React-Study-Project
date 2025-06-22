import { useState } from "react";
import Modal from "react-modal";
import "./Setting.css";

Modal.setAppElement("#root");

export default function Setting({ isOpen, onClose }) {
  function changeBgColor(color) {
    document.body.style.backgroundColor = color;
  }

  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={onClose}>
        <div className="setting-inner1">
          <h2>설정</h2>
          <button className="setting-close-btn" onClick={onClose}>
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="setting-inner">
          <div className="setting-category">배경색</div>
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
          </div>
        </div>
      </Modal>
    </div>
  );
}
