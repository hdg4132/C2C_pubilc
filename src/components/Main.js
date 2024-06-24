import { Link } from "react-router-dom"
import React from 'react'

export default function Main() {
  return (
    <div>
        <h1>Main</h1>
        <ul>
            <Link to="/signup"><li>회원가입</li></Link>
        </ul>

    </div>
    
  )
}
