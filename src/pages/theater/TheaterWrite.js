import Subbanner from '../../components/Subbanner'
import '../Movie.css'
import Editor from '../../components/Editor'
import { useContext } from 'react'
import { PostDispatchContext } from '../../App'
import {useNavigate} from 'react-router-dom' 

const Moviewrite=()=>{
    const nav = useNavigate();
    const {onCreate} = useContext(PostDispatchContext)
    const onSubmit = (input)=>{
        onCreate(input.title, input.status,input.content);
        nav('/movie', {replace: true})
    }
    return(
        <div className="Moviewrite">
            <Subbanner title={'요즘 영화'} text={'최근 개봉작과 개봉 예정작을 만나보세요.'} pageName={'sub_movie'}/>
             <div className="content_wrap">
                <div className="content_header">
                    <div className="container_fix clearfix">
                        <h3 className="content_tt">요즘 영화</h3>
                    </div>
                </div>
                <Editor onSubmit={onSubmit}/>
            </div>
        </div>
    )    
}

export default Moviewrite