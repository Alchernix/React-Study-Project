import { useState, useRef } from "react";
import WidgetContainer from "./WidgetContainer";
import { widget, widget2 } from "./WidgetContainer"; // 테스트용 - 나중에는 보드에서 관리
// import "./App.css";

// 나중에 위젯 컨테이너를 보드에서 리스트로 관리하고 map으로 돌면서서 랜더링하게 바꿔 주세요...
const initialBoard = [widget, widget2];

function App() {
  const [board, setBoard] = useState(initialBoard);
  // zIndex의 최댓값(가장 위에 있는 위젯의 zIndex)
  const maxZIndex = useRef(
    Math.max(...board.map((widget) => widget.style.zIndex))
  );
  // zIndex 최댓값 + 1 반환 - 드래그 시 사용
  function getNextZIndex() {
    maxZIndex.current += 1;
    return maxZIndex.current;
  }

  // 위젯 위치, z-index 업데이트해주는 함수...
  function updateWidgetStyle(id, style) {
    setBoard(
      board.map((widget) => {
        if (widget.id === id) {
          return { ...widget, style: style };
        } else {
          return widget;
        }
      })
    );
  }

  return (
    <>
      {board.map((widget) => (
        <WidgetContainer
          key={widget.id}
          widget={widget}
          updateWidgetStyle={updateWidgetStyle}
          getNextZIndex={getNextZIndex}
        />
      ))}
    </>
  );
}

export default App;
