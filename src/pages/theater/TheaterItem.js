import {useNavigate} from 'react-router-dom';

const Movieitem=({id, movie_status, title, img, content})=>{
    const nav = useNavigate();
    return(
        <li className="theater_con_it" onClick={()=>{nav(`/movie/post/${id}`)}}>
                <div className="img_wrap">
                    {img === null ?
                        <div className="img_empty"></div>
                    :
                        <img src={`//localhost:8000/${img}`}/>}
                </div>
                <div className='text_wrap'>
                    <h5>
                        <span className="theater_title">{title}</span></h5>
                    <p>{content}</p>
                </div>
        </li>
    )
}

export default Movieitem;