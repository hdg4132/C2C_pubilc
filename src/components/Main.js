import { Link } from "react-router-dom"
import React from 'react'

export default function Main() {
  return (
    <div>
        <h1>Main</h1>
        <ul>
            <Link to="/signup"><li>회원가입</li></Link>
            <Link to="/Login"><li>로그인</li></Link>
            <Link to="/Mypage"><li>마이페이지</li></Link>
            <Link to="/booking"><li>예약페이지</li></Link>
        </ul>

    </div>
    
  )
}
