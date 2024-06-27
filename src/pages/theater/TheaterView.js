import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Subbanner from '../../components/Subbanner'
import Viewer from '../../components/Viewer'
import '../Movie.css'
import Button from '../../components/Button'
import Axios from 'axios'

const Movieview=()=>{
    //const {onDelete} = useContext(PostDispatchContext);
    const params = useParams();
    const nav = useNavigate();
    /*
    const curPostItem = usePost(params.id)
    if(!curPostItem){
        return <div>데이터 로딩 중</div>
    }
    const {title, status, img, content} = curPostItem;
        */
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState(null); // 에러 상태 추가
    useEffect(() => {
        fetch(`http://localhost:8000/movie/post/${id}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Post not found');
        })
        .then(data => {
            setPost(data);
            setLoading(false); // 로딩 완료
          })
          .catch(error => {
            setError(error.message); // 에러 메시지 설정
            setLoading(false); // 로딩 완료
          });
      }, [id]);
  
    const onClickDelete=async()=>{
        if(window.confirm("삭제하시겠습니까?")){ // 확인버튼 = true
            //일기삭제로직
            await Axios.post(`http://localhost:8000/movie/post/delete`, {
                id: id,
                img:post.img
            })
               .then(() => {
                    // this.getList();
                    nav("/movie/1")
                })
                .catch((e) => {
                    console.error(e);
                });
            nav('/movie/1',{replace:true})
        }
    }
    if (loading) {
        return <div>Loading...</div>; // 로딩 상태 표시
    }

    if (error) {
        return <div>{error}</div>; // 에러 메시지 표시
    }

    if (!post) {
        return null; // post가 null일 경우 아무것도 렌더링하지 않음
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
                <div className="content_body">
                    <div className="container_fix">
                        <Viewer title={post.title} movie_status={post.movie_status} img={post.img} content={post.content}/>
                    </div>
                </div>
                <div className="content_tail">
                    <div className="container_fix">
                        <div className="btn_list">
                            <Button text={'목록으로'}  onClick={()=>{nav(`/movie/1`)}} />
                            <Button text={'삭제하기'}  onClick={()=>{onClickDelete()}} />
                            <Button text={'수정하기'}  onClick={()=>{nav(`/movie/edit/${params.id}`)}} />
                            <Button text={'글쓰기'} color={"color"} onClick={()=>{nav(`/movie/write`)}} /> 
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    )    
}

export default Movieview