import { useParams } from "react-router-dom";

const MovieEdit=()=>{
    const params = useParams();
    return( 
        <>
            {params.id}번 게시글 수정
        </>
    )
}

export default MovieEdit;