
import star_fill from '../assets/star_fill.png'
import star_line from '../assets/star_line.png'

const Viewer=({id, title, movie_status, img, content,userid})=>{
    return(
        <div className="Viewer">
            <div className="content_title">
                <h5><span className={`status ${movie_status==='상영중'?'ing':''}`}>{movie_status}</span>{title}</h5>
            </div>
            <div className="content_con">
                <p>{userid}</p>
                <div className='img_wrap'>
                    <img src={`//localhost:8000/uploads/${img}`}/>
                </div>
                <div className='txt_wrap'>
                    {content}
                </div>
            </div>
            <div className="view_reply">
                <div className="reply_tt">
                    <p>댓글 / 기대평</p>
                </div>
                {/*}
                <ul className="reply_list">
                    <li>
                        <div className="reply_header">
                            <p className="reply_info">댓글 작성자 명 <span className="reply_star">
                            <img src={star_fill}/>
                            <img src={star_fill}/>
                            <img src={star_fill}/>
                            <img src={star_fill}/>
                            <img src={star_line}/>
                        </span></p>
                        </div>
                        <div className="reply_con">
                            댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 
                        </div>
                    </li>
                    <li>
                        <div className="reply_header">
                            <p className="reply_info">댓글 작성자 명 <span className="reply_star">
                            <img src={star_fill}/>
                            <img src={star_fill}/>
                            <img src={star_fill}/>
                            <img src={star_fill}/>
                            <img src={star_line}/>
                        </span></p>
                        </div>
                        <div className="reply_con">
                            댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 댓글 내용이 노출됩니다. 
                        </div>
                    </li>
                </ul>
                */}
            </div>
            {/*}
            <div className="write_reply">
                <form action="" className="clearfix">
                    <div className="reply_header">
                        <p className="reply_info">댓글 작성자 명 <span className="reply_star">
                            <img src={star_fill}/>
                            <img src={star_fill}/>
                            <img src={star_fill}/>
                            <img src={star_fill}/>
                            <img src={star_line}/>
                        </span>
                        </p>
                    </div>
                    <textarea name="" id=""></textarea>
                    <button className="btn_default color">댓글쓰기</button>
                </form>
            </div>
            */}
        </div>
    )
}

export default Viewer;