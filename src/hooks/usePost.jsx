import { useContext, useEffect, useState } from "react";
import { PostStateContext } from "../App";
import {useNavigate} from 'react-router-dom'

const usePost=(id)=>{
    const nav = useNavigate();
    const data = useContext(PostStateContext)
    const [curPostItem, setCurPostItem] = useState();
    useEffect(()=>{
        const currentPostItem = data.find((item)=>String(item.id) ===String(id));
        
        if(!currentPostItem){
            window.alert('존재하지 않는 게시글입니다.')
            nav('/movie', {replace:true})
            }
            return setCurPostItem(currentPostItem);
            
            
    },[id, data])

    return curPostItem;
}

export default usePost;