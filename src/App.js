import "./reset.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup/Signup.js";
import Main from "./components/Main.js";
import Login from "./components/Logins/Login.js";
import Mypage from "./components/moviepage/MyPage.js";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />} /> {/* 회원가입 - kwj */}
          <Route path="/Login" element={<Login />}></Route> {/* 로그인 - kth */}
          <Route path="/Mypage" element={<Mypage />}></Route> {/* 마이페이지 - kth */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
