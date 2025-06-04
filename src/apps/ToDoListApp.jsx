import { useState, useRef, useEffect} from "react";

export default function ToDoListApp() {
 const [toDoList, setToDoList] = useState([])

 return(
    <div>
        <p>작업예정</p>
    </div>
 )
}

ToDoListApp.appName = "ToDo";
ToDoListApp.Icon = () => <span style={{ fontSize: "24px" }}>✅</span>;