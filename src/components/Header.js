import "./common.css"
import "./Header.css"
import img from "../assets/logo.png"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"

const Header=()=>{
    const [loggedIn, setLoggedIn] = useState(false); // 로그인 상태를 관리하는 state
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
    const Server_URL = process.env.REACT_APP_Server_Side_Address; // 환경변수에서 서버 URL을 가져옴

    // 페이지가 로드될 때 로그인 상태를 확인하고 상태를 업데이트
    useEffect(() => {
        const storedLoggedIn = sessionStorage.getItem("loggedIn");
        if (storedLoggedIn) {
        setLoggedIn(true); // 로그인 상태라면 loggedIn을 true로 설정
        }
    }, [setLoggedIn]);

    // 로그아웃 시 세션 스토리지에서 로그인 상태 제거
    const handleLogout = () => {
        sessionStorage.removeItem("loggedIn");
        sessionStorage.removeItem("usertype"); // usertype 항목 제거
        sessionStorage.removeItem("userData"); // userData 항목 제거
        setLoggedIn(false); // 로그인 상태를 false로 설정
        navigate("/"); //로그아웃 후 메인 페이지로 이동
        window.location.reload(); // 페이지를 새로 고침
    };
    const userInfo = JSON.parse(sessionStorage.getItem("userData"));
    const nav = useNavigate();
    return(
        <header>
            <div className="container_fix">
                <h1 className="logo"><a onClick={()=>{nav('/')}}><img src={img} alt="C2C" /></a></h1>
                <nav>
                    <ul className="nav">
                        <li className="menu">
                            <a onClick={()=>{nav('booking')}}>빠른 예매</a>
                        </li>
                        <li className="menu"><a onClick={()=>{nav('movie/1')}}>요즘 영화</a></li>
                        <li className="menu close"><a >요즘 극장</a></li>
                        <li className="menu close">
                            <a>공지사항/이벤트</a>
                            <ul className="sub_menu"></ul>
                        </li>
                        <li className="menu"><a onClick={()=>{nav('contact')}}>고객센터</a></li>
                    </ul>
                </nav>
                <ul className="member_info">
                {userInfo == null ? (
                    <>
                    <li><a onClick={()=>{nav('signup')}}>회원가입</a></li>
                    <li><a onClick={()=>{nav('login')}}>로그인</a></li>
                    </>
                ):
                (<>
                <li><a onClick={()=>{nav('mypage')}}>마이페이지</a></li>
                <li><a onClick={handleLogout}>로그아웃</a></li>
                </>)}
                    <li className="all_menu"><a href=""><span className="all_menu_span"></span></a></li>
                </ul>
            </div>
        </header>
    )
}

export default Header