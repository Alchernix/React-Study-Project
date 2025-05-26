import { useState, useRef, useReducer } from 'react'
import { createContext } from 'react'
import { useEffect, useEffectEvent } from 'react'
//저장, 불러오기, 위젯 추가&삭제, 편집 모드

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

export default function Board() {
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