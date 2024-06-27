import {useNavigate} from 'react-router-dom';

const Movieitem=({id, movie_status, title, img, content})=>{
    const nav = useNavigate();
    return(
        <li className="movie_con_it" onClick={()=>{nav(`/movie/post/${id}`)}}>
                <div className="img_wrap">
                    {img === null ?
                        <div className="img_empty"></div>
                    :
                        <img src={`//localhost:8000/uploads/${img}`}/>}
                </div>
                <h5>
                    {
                        movie_status==='상영중'?<span className="status ing">상영중</span>:<span className="status">개봉예정</span>
                    }
                    <span className="movie_title">{title}</span></h5>
                <p>{content}</p>
        </li>
    )
}

export default Movieitem;