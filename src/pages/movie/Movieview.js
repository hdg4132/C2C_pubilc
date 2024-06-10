import { useParams, Link } from 'react-router-dom'
import Subbanner from '../../components/Subbanner'
import Viewer from '../../components/Viewer'
import './movie.css'

const Movieview=()=>{
    const params = useParams();
    return(
        <div className="Moviewrite">
            <Subbanner></Subbanner>
             <div className="content_wrap">
                <div className="content_header">
                    <div className="container_fix clearfix">
                        <h3 className="content_tt">요즘 영화</h3>
                    </div>
                </div>
                <div className="content_body">
                    <div className="container_fix">
                        {params.id}번 게시글
                        <Viewer/>
                    </div>
                </div>
                <div className="content_tail">
                    <div className="container_fix">
                        <div className="btn_list">
                            <Link to='/movie' className='btn_default'>목록</Link>
                            <Link to='/Movie/write' className='btn_default color'>글쓰기</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )    
}

export default Movieview