import { Link } from 'react-router-dom'
import Subbanner from '../../components/Subbanner'
import Header from '../../components/Header'
import temp_img from '../../assets/movie_img.png'
import Button from '../../components/Button'
import './movie.css'

const Movielist=()=>{
    return(
        <div className="Movielist">
            <Header></Header>
            <Subbanner></Subbanner>
             <div className="content_wrap">
                <div className="content_header">
                    <div className="container_fix clearfix">
                        <h3 className="content_tt">요즘 영화</h3>
                    <form action="" className="search_form">
                        <input type="text" placeholder="검색어를 입력하세요" />
                        <button type="submit"><span className="search"></span></button>
                    </form>
                    </div>
                </div>
                <div className="content_body">
                    <div className="container_fix">
                        <ul className="movie_con">
                            <li className="movie_con_it">
                                <a href="/movie/view">
                                    <div className="img_wrap">
                                        <img src={temp_img}/>
                                    </div>
                                    <h5><span className="status">개봉예정</span> <span className="movie_title">설계자들설계자들설계자들</span></h5>
                                    <p>영화에 대한 설명이 간략하게 노출됩니다</p>
                                </a>
                            </li>
                            <li className="movie_con_it">
                                <a href="">
                                    <div className="img_wrap">
                                        <img src={temp_img}/>
                                    </div>
                                    <h5><span className="status ing">상영중</span> <span className="movie_title">설계자들설계자들설계자들</span></h5>
                                    <p>영화에 대한 설명이 간략하게 노출됩니다</p>
                                </a>
                            </li>
                            <li className="movie_con_it">
                                <a href="">
                                    <div className="img_wrap">
                                        <img src={temp_img}/>
                                    </div>
                                    <h5><span className="status">개봉예정</span> <span className="movie_title">설계자들설계자들설계자들</span></h5>
                                    <p>영화에 대한 설명이 간략하게 노출됩니다</p>
                                </a>
                            </li>
                            <li className="movie_con_it">
                                <a href="">
                                    <div className="img_wrap">
                                        <img src={temp_img}/>
                                    </div>
                                    <h5><span className="status">개봉예정</span> <span className="movie_title">설계자들설계자들설계자들</span></h5>
                                    <p>영화에 대한 설명이 간략하게 노출됩니다</p>
                                </a>
                            </li>
                            <li className="movie_con_it">
                                <a href="">
                                    <div className="img_wrap">
                                        <img src={temp_img}/>
                                    </div>
                                    <h5><span className="status">개봉예정</span> <span className="movie_title">설계자들설계자들설계자들</span></h5>
                                    <p>영화에 대한 설명이 간략하게 노출됩니다</p>
                                </a>
                            </li>
                            <li className="movie_con_it">
                                <a href="">
                                    <div className="img_wrap">
                                        <img src={temp_img}/>
                                    </div>
                                    <h5><span className="status">개봉예정</span> <span className="movie_title">설계자들설계자들설계자들</span></h5>
                                    <p>영화에 대한 설명이 간략하게 노출됩니다</p>
                                </a>
                            </li>
                            <li className="movie_con_it">
                                <a href="">
                                    <div className="img_wrap">
                                        <img src={temp_img}/>
                                    </div>
                                    <h5><span className="status">개봉예정</span> <span className="movie_title">설계자들설계자들설계자들</span></h5>
                                    <p>영화에 대한 설명이 간략하게 노출됩니다</p>
                                </a>
                            </li>
                            <li className="movie_con_it">
                                <a href="">
                                    <div className="img_wrap">
                                        <img src={temp_img}/>
                                    </div>
                                    <h5><span className="status">개봉예정</span> <span className="movie_title">설계자들설계자들설계자들</span></h5>
                                    <p>영화에 대한 설명이 간략하게 노출됩니다</p>
                                </a>
                            </li>
                        
                        </ul>
                    </div>
                </div>
                <div className="content_tail">
                    <div className="container_fix">
                        <div className="btn_list">
                            <Button text={'글쓰기'} color={'color'} onClick={()=>{console.log('click')}}/>
                        </div>
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
                    </div>
                </div>
            </div>
        </div>
    )    
}

export default Movielist