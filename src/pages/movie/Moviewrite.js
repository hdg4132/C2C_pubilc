import Subbanner from '../../components/Subbanner'
import './movie.css'
import Editor from '../../components/Editor'

const Moviewrite=()=>{
    return(
        <div className="Moviewrite">
            <Subbanner></Subbanner>
             <div className="content_wrap">
                <div className="content_header">
                    <div className="container_fix clearfix">
                        <h3 className="content_tt">요즘 영화</h3>
                    </div>
                </div>
                <Editor></Editor>
            </div>
        </div>
    )    
}

export default Moviewrite