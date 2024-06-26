import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState("");

  const Server_URL = process.env.REACT_APP_Server_Side_Address;

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/login`, {
        email: email,
        password: password,
        usertype: "1",
      });

      if (response.data.success) {
        const { usertype, userId, username } = response.data.data[0];
        console.log("userid:", userId);
        console.log("username:", username);
        console.log("usertype:", usertype);

        const userData = {
          userid: userId,
          username: username,
          usertype: usertype,
        };
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("userData", JSON.stringify(userData));
        sessionStorage.setItem("usertype", usertype);
        setLoginStatus("로그인이 완료되었습니다.");
        navigate("/Mypage");
      } else {
        setLoginStatus("로그인 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("로그인에 실패하였습니다. 회원가입을 해주세요.");
    }
  };

  return (
    <div>
      <div className="subBanner_login">
        <div className="container_fix">
          <h2 className="Banner_text login">로그인</h2>
          <p className="Banner_text sub">Come 2 Cinema와 함께해요</p>
        </div>
      </div>
      <div>
        <p className="login_text">로그인</p>
        <div className="Line1"></div>
        <div className="loginbox">
          <input
            type="email"
            name="userEmail"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="loginbutton">
          <button
            className="button_text outline"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
          <button
            className="button_text primary"
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            로그인
          </button>
        </div>
        {loginStatus && <div className="loginStatus">{loginStatus}</div>}
      </div>
    </div>
  );
}

export default LoginPage;
