import "./reset.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup/Signup.js";
import Main from "./components/Main.js";
import { TicketBack } from './pages/ticket/TicketBack';
import { TicketModal} from './pages/ticket/TicketModal';
import TicketCompleteOrder from './pages/ticket/TicketCompleteOrder';
import Login from "./components/Logins/Login.js";
import Mypage from "./components/moviepage/MyPage.js";


function App() {

    // 모달창용 location.state
    const location = useLocation();
    const background = location.state && location.state.background;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />} /> {/* 회원가입 - kwj */}
          <Route path='/ticket' element={<TicketBack/>}> {/* ticket모달용 뒷페이지 추후 비사용가능성있음 hms */}
              {background && <Route path="/ticket/modal" element={<TicketModal />} />}  {/* 결제용 모달창 hms */}
              </Route>
              <Route path="/completeOrder" element={<TicketCompleteOrder />} /> {/* 결제완료페이지 hms */}
          <Route path="/Login" element={<Login />}></Route> {/* 로그인 - kth */}
          <Route path="/Mypage" element={<Mypage />}></Route> {/* 마이페이지 - kth */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
