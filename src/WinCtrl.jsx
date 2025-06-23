import { useEffect, useRef, useState } from "react"

export default function WinCtrl({windows, apply}){
    const [savedList, setSavedList] = useState(() => {
        return  JSON.parse(localStorage.getItem("Board-saves") || "[]")
    })
    const saveIdCounter = useRef(0) 

      //창 관리용 함수
    const saveSpace = (data) => {
        localStorage.setItem("Board-saves", JSON.stringify(data));
    }

    useEffect(() => {
        let t = JSON.parse(localStorage.getItem("Board-saves") || "[]")
        if (t.length != 0) {saveIdCounter.current = Math.max(...savedList.map((i) => i.date)) + 1}
    }, [])

    const saveNewSpace = (name, windows) => {
        const currentSave = savedList
        saveSpace([...currentSave, {id: saveIdCounter.current++, name: name, date: Date.now() , data: windows}])
    }

    const deleteSpace = (id) => {
        const currentSave = savedList
        saveSpace(currentSave.filter((i) => i.id !== id))
    }

    const loadSpace = (id) => {
        const space = currentSave.filter((i) => i.id == id)[0].data
        apply(space)
    }

}