import {useContext, useEffect, useState} from 'react'
import { PostStateContext } from '../../App'
import { useNavigate,useParams } from 'react-router-dom'
import Subbanner from '../../components/Subbanner'
import Header from '../../components/Header'
import Button from '../../components/Button'
import '../Movie.css'
import TheaterItem from './TheaterItem'
import Pagination from '../../components/Pagination'

const Movielist=()=>{

    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPosts, setCurrentPosts] = useState([]);
    const nav = useNavigate();
    const { page } = useParams();
    const postPerPage = 8;

    
    useEffect(() => {
        fetch('//localhost:8000/movie')
          .then(response => response.json())
          .then(data => {setPosts(data);
          setCount(data.length);})
          .catch(error => console.error('Error fetching posts:', error));
          
          setCount(posts.length);
      }, []);



       //검색 초기데이터 빈칸
       const [search,setSearch] = useState('');
       const onChangeSearch =(e)=>{
           setSearch(e.target.value)
       }
   
   
   
   
       //검색 필터링 함수
       const getSearchResult=()=>{
           //원하는 데이터만 남기려면>원치않는 데이터 빼기
           //검색창이 빈칸이면 데이터 전체표시, 아니라면 검색창안의 데이터를 전부 소문자로바꿔서 포함하고 있는 데이터만 남기기
           return search==='' ? posts : posts.filter((it)=>it.content.toLowerCase().includes(search.toLowerCase())) //  app.js에서 프롭스로 가져와서 쓸수있긴한데 각각의 항목안에 컨텐츠<에서 같은 걸 찾는거라 정확하게 지목을 list에서 하는게 좀더편해서 리스트에서 작성하는거고
       }
   
       
    /* 페이지네이션 */
    
    useEffect(() => {
        const indexOfLastPost = (page || currentPage) * postPerPage;
        const indexOfFirstPost = indexOfLastPost - postPerPage;
        setCurrentPosts(getSearchResult().slice(indexOfFirstPost, indexOfLastPost));
    }, [page, search, posts, currentPage]);





    const handleChangePage = (page) => {
        const newUrl = `/movie/${page}`;
        nav(newUrl);
        setCurrentPage(page);
    };
    return(
        <div className="Movielist">
            <Header></Header>
            <Subbanner title={'요즘 극장'} text={'이색 극장들을 소개합니다.'} pageName={`sub_theater`}/>
             <div className="content_wrap">
                <div className="content_header">
                    <div className="container_fix clearfix">
                        <h3 className="content_tt">요즘 극장</h3>
                    <form action="" className="search_form">
                        <input type="text" placeholder="검색어를 입력하세요"  value={search} onChange={onChangeSearch}/>
                        <button type="submit"><span className="search"></span></button>
                    </form>
                    </div>
                </div>
                <div className="content_body">
                    <div className="container_fix">
                        <ul className="theater_con">
                        { currentPosts && currentPosts.map((it)=>(
                            <TheaterItem key={it.id}{...it}/>))}
                        </ul>
                    </div>
                </div>
                <div className="content_tail">
                    <div className="container_fix">
                        <div className="btn_list">
                            <Button text={'글쓰기'} color={'color'} onClick={()=>{nav('/movie/write')}}/>
                        </div>
                        <Pagination page={page || currentPage} count={count} handleChangePage={handleChangePage} postPerPage={postPerPage} />
                        {/*
                        <div className="pagination">
                            <ul className="pagination_wrap">
                                <li className="left double">
                                    <a href=""><span></span></a>
                                </li>
                                <li className="left">
                                    <a href=""><span></span></a>
                                </li>
                                <li className="active">
                                    <a href="">1</a>
                                </li>
                                <li>
                                    <a href="">2</a>
                                </li>
                                <li>
                                    <a href="">3</a>
                                </li>
                                <li>
                                    <a href="">4</a>
                                </li>
                                <li>
                                    <a href="">5</a>
                                </li>
                                <li className="right">
                                    <a href=""><span></span></a>
                                </li>
                                <li className="right double">
                                    <a href=""><span></span></a>
                                </li>
                            </ul>
                        </div>
                        */}
                    </div>
                </div>
            </div>
        </div>
    )    
}

export default Movielist