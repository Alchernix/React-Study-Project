import { useState, useRef, useEffect} from "react";
import "./ToDoListApp.css"
//todo: Board.jsx -> 작업공간 저장 및 불러오기 만들기
// 시간순/ 중요도순 정렬 추가

export default function ToDoListApp() {
    const [toDoList, setToDoList] = useState([])
    const [currentTab, setcurrentTab] = useState("all")
    const [hoveredItem, setHoveredItem] = useState(null)
    const inputText = useRef(null)
    const todoidcounter = useRef(0)
    const toDoCategory = useRef(["all", "unfinished", "finished"])



    useEffect(() => {
        const savedTodos = JSON.parse(localStorage.getItem("Board-todo") || "[]");
        if (savedTodos.length > 0) {
            setToDoList(savedTodos);
            const maxId = Math.max(...savedTodos.map(item => item.id), 0);
            todoidcounter.current = maxId + 1;
        }
    },[])

    useEffect(() => {
        localStorage.setItem("Board-todo", JSON.stringify(toDoList));
    },[toDoList])

    function addToDo(){
        let newItem = {
            id : todoidcounter.current++,//Math.max(toDoList.map(item => item.id)),
            title: inputText.current.value,
            finished: false,
        }
        let new_list = [...toDoList, newItem]
        inputText.current.value = "";
        setToDoList(new_list)
    }

    function deleteToDo(id){
        let new_list = toDoList.filter(item => item.id != id)
        setToDoList(new_list)
    }

    function deleteFinished(){
        let new_list = toDoList.filter(item => item.finished == false)
        setToDoList(new_list)
    }

    function checkFinished(id){
        let new_list = toDoList.map(item => {
            if (item.id != id){
                return item
            }
            else return {
            id : item.id,
            title: item.title,
            finished: !item.finished,
            }
        })
        setToDoList(new_list)
    }

 return(
    <div style={{"display": "flex", "flexDirection": "column"}}>
        <ul className="todo-taplist">
            {toDoCategory.current.map(item =>  
                 <li key = {item}>
                {
                currentTab == item ? <span className="current-tap" onClick={(e) => setcurrentTab(item)}>{item}</span> : 
                <span className="tap" onClick={(e) => setcurrentTab(item)}>{item}</span>
                }
                </li>
            
            )}
        </ul>
        <ul className="todo-list">
            {toDoList.filter(item => {
                if (currentTab == "all") return true
                else if (currentTab == "unfinished") return item.finished == false
                else if (currentTab == "finished") return item.finished == true
                else return item.category == currentTab
            }).map(item =>
            <li className="todo-item" key = {item.id} onMouseEnter={(e) => setHoveredItem(item.id)} onMouseLeave={(e) => setHoveredItem(null)}>
                
                {item.finished? <button id="todo_check" className="todo-done" onClick={(e) => checkFinished(item.id)}>✅</button>: <button id="todo_check" className="todo-not"onClick={(e) => checkFinished(item.id)}>○</button>}
               <span>{item.title}</span>
                {hoveredItem == item.id? <button id="todo_delete" onClick={(e) => deleteToDo(item.id)}>삭제</button>:<></>}
            </li>
            )}
        </ul>
        <div className="todo-inputbox" >
            <input type="todo_title" placeholder="할 일을 입력하세요" ref={inputText}></input>
            <button id="todo_add" onClick={addToDo}>추가</button>
        </div>
        <button className="todo-d" onClick={deleteFinished}>완료한 할 일 모두 삭제하기</button>
    </div>
 )
}

ToDoListApp.appName = "ToDo";
ToDoListApp.Icon = () => <span style={{ fontSize: "24px" }}>✅</span>;