import { useState, useRef, useEffect} from "react";
//todo: Board.jsx -> 작업공간 저장 및 불러오기 만들기
//todo: 분류 기능 - 카테고리별 탭 버튼이랑 카테고리 추가 변경 등
// 시간순/ 중요도순 정렬렬
//오프라인 저장
//마우스를 올리면 삭제버튼이 뜨도록

export default function ToDoListApp() {
    const [toDoList, setToDoList] = useState([])
    const [currentTab, setcurrentTab] = useState("all")
    const inputText = useRef(null)
    const todoidcounter = useRef(0)

    useEffect(() => {
        console.log(toDoList)
    },[toDoList])

    function addToDo(){
        let newItem = {
            id : todoidcounter.current++,//Math.max(toDoList.map(item => item.id)),
            title: inputText.current.value,
            finished: false,
        }
        setToDoList((prev) => [...prev, newItem])
        console.log(toDoList)
    }

    function deleteToDo(id){
        setToDoList((prev) => prev.filter(item => item.id != id))
    }

    function checkFinished(id){
        setToDoList((prev) => prev.map(item => {
            if (item.id != id){
                return item
            }
            else return {
            id : item.id,
            title: item.title,
            finished: !item.finished,
            }
        })
        )
    }

 return(
    <div>
        <ul>
            {toDoList.filter(item => {
                if (currentTab == "all") return true
                else if (currentTab == "unfinished") return item.finished == false
                else if (currentTab == "finished") return item.finished == true
                else return item.category == currentTab
            }).map(item =>
            <li key = {item.id}>
                <span>{item.title}</span>
                <button id="todo_check" onClick={(e) => checkFinished(item.id)}>{item.finished?"완료됨":"미완료"}</button>
            </li>
            )}
        </ul>
            <input type="todo_title" ref={inputText}></input>
            <button id="todo_add" onClick={addToDo}>추가</button>
    </div>
 )
}

ToDoListApp.appName = "ToDo";
ToDoListApp.Icon = () => <span style={{ fontSize: "24px" }}>✅</span>;