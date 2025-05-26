import { useState, useRef, useReducer } from 'react'
import { createContext } from 'react'
import { useEffect, useEffectEvent } from 'react'
import "./Sidepanel.css";
import SidePanelApp  from './Sidepanel'
import Window from './WidgetContainer';

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
      

      <SidePanelApp openApp={openApp} windows={windows}/>

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



//추후 수정 예정

//기본 위젯들
const initialWidgets = []

//위젯 위치 저장
function saveWidgets(widgets){
    localStorage.setItem('widgets', JSON.stringify(widgets))
}

//위젯 위치 불러오기
function loadWidgets(){
    return JSON.parse(localStorage.getItem(('widgets') || '[]'))
}


function widgetsReducer(widgets, action) {
    switch (action.type) {
        //설정 불러오기 용
        case 'load':{
            return action.data
        } 

        //위젯 추가
        case 'add': {
            return [...widgets, {
                id: action.widget.id,
                type: action.widget.type,
                style: action.widget.style,
                //기타 필요한 정보?? 우선 WidgetContainer.jsx와 App.jsx 내용을 참고해서 적었습니다.
            }];
        }
        //삭제
        case 'delete': {
            return widgets.filter(w => w.id !== action.widget.id);
        }

      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }

function tmp() {
    const nextWidgetId = useRef(0);
    //위젯 데이터
    const [widgets, dispatch] = useReducer(widgetsReducer, initialWidgets)
    //편집모드 여부
    const [isEditMode, setIsEditMode] = useState(false)

    // 열었을 때 저장된 내용 불러오기
    useEffect(() => {
        const t = loadWidgets()
        nextWidgetId.current = Math.max(...t.map(item => item.id))
        dispatch({
            type: 'lode',
            data: t
        })
        }, [])

    //편집 모드 종료시 저장
    const edited = useEffectEvent(() => {
        saveWidgets(widgets)
        });
    useEffect(() => {
        if(!isEditMode){
            edited()
        }
        }, [isEditMode])


    //-----
    //편집 모드 토글
    function toggleEditMode(){
        setIsEditMode(!isEditMode)
    }

    //위젯 추가
    function handleAddWidget(widget) {
        dispatch({
            type: 'add',
            widget: {
                id:nextWidgetId.current++,
                type: widget.type,
                style: widget.style,
            },
        })
    }

    //위젯 삭제
    function handleDeleteWidget(widget) {
        dispatch({
            type: 'delete',
            widget: widget,
        }
        )
    }
    //-------

    //todo: 가로세로 100%로
    return (
        <div>
            {widgets.map((widget) => (
                <WidgetContainer
                    key = {widget.id}
                    widget = {widget}
                    updateWidgetStyle = {updateWidgetStyle}
                    getNextZIndex = {getNextZIndex}

                    deleteWidget = {handleDeleteWidget} //위젯 삭제 함수
                />)
                )}
        </div>
    )
}