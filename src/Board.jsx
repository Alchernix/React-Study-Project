import { useState } from 'react'
import { useReducer } from 'react'
import { useEffect, useEffectEvent } from 'react'

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


let nextWidgetId = 0; //todo: 저장 데이터 불러올 때 갱신 잘 하기

export default function Board() {
    const [widgets, dispatch] = useReducer(widgetsReducer, initialWidgets)
    const [isEditMode, setIsEditMode] = useState(false)

    // 열었을 때 저장된 내용 불러오기
    useEffect(() => {
        dispatch({
            type: 'lode',
            data: loadWidgets()
        })
        }, [])

    //편집 모드 종료시 저장
    //todo: 각각의 위젯의 size와 pos도 저장해야 함 
    const edited = useEffectEvent(() => {
        saveWidgets(widgets)
        });
    useEffect(() => {
        if(!isEditMode){
            edited()
        }
        }, [isEditMode])


    //위젯 추가
    function handleAddWidget(widget) {
        dispatch({
            type: 'add',
            widget: {
                id:nextWidgetId++,
                type: widget.type,
                style: widget.style,
            },
        })
    }

    //위젯 삭제
    function handleAddWidget(widget) {
        dispatch({
            type: 'delete',
            widget: widget,
        }
        )
    }

    return (
        <div>
            {widgets.map((widget) => (
                <WidgetContainer
                    key = {widget.id}
                    widget = {widget}
                    updateWidgetStyle
                    getNextZIndex
                />)
                )}
        </div>
    )
}