import { useEffect, useRef, useState } from "react"
import Modal from "react-modal";
import "./WinCtrl.css";
Modal.setAppElement("#root");

export default function WinCtrl({isOpen, onClose, windows, apply}){
    const [savedList, setSavedList] = useState(() => {
        return  JSON.parse(localStorage.getItem("Board-saves") || "[]")
    })
    const saveIdCounter = useRef(0) 
    const [hoveredItem, setHoveredItem] = useState(null)
    const inputText = useRef(null)

      //창 관리용 함수
    const saveSpace = (data) => {
        localStorage.setItem("Board-saves", JSON.stringify(data));
        setSavedList(data)
    }

    useEffect(() => {
        let t = JSON.parse(localStorage.getItem("Board-saves") || "[]")
        if (t.length != 0) {saveIdCounter.current = Math.max(...savedList.map((i) => i.id)) + 1}
    }, [])

    const saveNewSpace = () => {
        const currentSave = savedList
        saveSpace([...currentSave, {id: saveIdCounter.current++, name: inputText.current.value, data: windows}])
    }

    const deleteSpace = (id) => {
        const currentSave = savedList
        saveSpace(currentSave.filter((i) => i.id !== id))
    }

    const loadSpace = (id) => {
        const currentSave = savedList
        const space = currentSave.filter((i) => i.id == id)[0].data
        localStorage.setItem("Board", JSON.stringify(space));

        apply(space)
    }

    return (
        <div>
            <Modal isOpen={isOpen} onRequestClose={onClose}>
                <h2>위젯 배치 저장/불러오기</h2>
                <button className="setting-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
            
            <ul className="save-list">
            {savedList.map(item =>
            <li className="save-item" key = {item.id}  onMouseEnter={(e) => setHoveredItem(item.id)} onMouseLeave={(e) => setHoveredItem(null)}>
               <span onClick={(e) => {loadSpace(item.id); onClose()}}>{item.name}</span>
                {hoveredItem == item.id? <button id="save_delete" onClick={(e) => deleteSpace(item.id)}>삭제</button>:<></>}
            </li>
            
            )}
        </ul>
        <div className="save-inputbox" >
            <input type="save_name"  ref={inputText}></input>
            <button id="save_add" onClick={saveNewSpace}>추가</button>
        </div>
        </Modal>
        </div>
    )

}