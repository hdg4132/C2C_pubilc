import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Editor from "../../components/Editor";
import Subbanner from "../../components/Subbanner";
import { useContext, useEffect,useState } from "react";
import { PostDispatchContext, PostStateContext } from '../../App'
import usePost from "../../hooks/usePost";

const MovieEdit=()=>{
    const nav = useNavigate();
    const params = useParams();
    const {onEdit} = useContext(PostDispatchContext)
    const curPostItem = usePost(params.id);
    const onSubmit=(input)=>{
        if(window.confirm('정말 수정하시겠습니까?')){
            onEdit(
                params.id, 
                input.title, 
                input.status, 
                input.content
                ) 
                nav('/movie',{replace:true })
            }
        }
            
    return( 
        <>
        {params.id}번 게시글 수정
        <div className="Moviewrite">
            <Subbanner title={'요즘 영화'} text={'최근 개봉작과 개봉 예정작을 만나보세요.'} pageName={'sub_movie'}/>
             <div className="content_wrap">
                <div className="content_header">
                    <div className="container_fix clearfix">
                        <h3 className="content_tt">요즘 영화</h3>
                    </div>
                </div>
                <Editor initData={curPostItem} onSubmit={onSubmit}/>
            </div>
        </div>
        </>
    )
}

export default MovieEdit;