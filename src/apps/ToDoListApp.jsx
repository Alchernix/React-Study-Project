import { useState, useRef, useEffect} from "react";

//todo: 분류 기능/정렬
export default function ToDoListApp() {
    const [toDoList, setToDoList] = useState([])
    const inputText = useRef(null)

    function addToDo(){
        let newItem = {
            id : Math.max(toDoList.map(item => item.id)),
            title: inputText.current.value,
            finished: false,
        }
        setToDoList((prev) => [...prev, newItem])
    }

    function deleteToDo(id){
        setToDoList((prev) => prev.filter(item => item.id != id))
    }

 return(
    <div>
        <ul>
            {toDoList.map(item =>
            <li key = {item.id}>
                {item.title}
            </li>
            )}
        </ul>
        <form>
            <input type="text" ref={inputText}></input>
            <button id="add" onClick={addToDo}></button>
        </form>
        <p>작업예정</p>
    </div>
 )
}

ToDoListApp.appName = "ToDo";
ToDoListApp.Icon = () => <span style={{ fontSize: "24px" }}>✅</span>;