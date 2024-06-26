
import "./reset.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup/Signup.js";
import Main from "./components/Main.js";
import Login from "./components/Logins/Login.js";
import Mypage from "./components/moviepage/MyPage.js";
import React, { useState, useEffect } from 'react'; // React에서 필요한 기능들을 가져옴

import axios from 'axios'; // 서버에 요청을 보내는 도구를 가져옴
import QuickBooking from './pages/./Ticket/QuickBooking'; // 빠른 예약 기능을 하는 컴포넌트를 가져옴
import SeatBooking from './pages/Ticket/SeatBooking'; // 좌석 예약 기능을 하는 컴포넌트를 가져옴
import MovieInfo from './pages/Ticket/MovieInfo'; // 영화 정보를 보여주는 컴포넌트를 가져옴
import Reservations from './pages/Ticket/Reservations'; // 예약 내역을 보여주는 컴포넌트를 가져옴
import PaymentPage from './pages/Ticket/PaymentPage'; // 결제 페이지를 보여주는 컴포넌트를 가져옴
import './pages/Ticket/Ticket.css'; // 스타일(디자인) 파일을 가져옴



const App = () => { 
  const [selectedMovie, setSelectedMovie] = useState([null]); // 선택한 영화를 저장할 공간
  const [selectedDate, setSelectedDate] = useState(null); // 선택한 날짜를 저장할 공간
  const [selectedTime, setSelectedTime] = useState(null); // 선택한 시간을 저장할 공간
  const [selectedSeats, setSelectedSeats] = useState([]); // 선택한 좌석들을 저장할 공간
  const [moviepic, setMoviepic] = useState(""); // 영화 사진을 저장할 공간
  const [movie, setMovie] = useState([]); // 영화 목록을 저장할 공간

  useEffect(() => { // 컴포넌트가 화면에 처음 나타날 때 실행되는 부분
    async function resData() { // 비동기로 서버에서 데이터를 가져오는 함수
      const movies = await axios.get(`http://localhost:8000/movie`, {}); // 서버에서 영화 데이터를 가져옴
      const data = movies.data; // 서버에서 받은 데이터를 변수에 저장
      setMovie(data); // 가져온 영화 데이터를 state에 저장
    }
    resData(); // 위에서 만든 함수 resData를 실행
  }, []); // 빈 배열을 넣어줘서 컴포넌트가 처음 나타날 때만 실행

  const [movieId, setMoviepId] = useState(1); // 예약된 좌석들을 저장할 공간

  useEffect(() => {  // 선택한 영화가 변경될 때마다 실행
    movie.map((movie) => { // 영화목록을 순회함
      if (movie.name === selectedMovie) // 현재 영화 이름이 선택된 영화와 일치하는지 확인
        return setMoviepId(movie.id); // 일치하면 해당 영화의 ID를 설정
    });
  }, [selectedMovie]); // 선택된 영화가 변경될 때마다 실행
  console.log(movieId); // 가져온 영화 데이터를 콘솔에 출력

  return ( // 화면에 보여줄 내용을 작성하는 부분입니다.
    <div className="container"> 

    <Router>

      <Routes>  
        {/*-------------------kjh-------------------------*/}

        <Route path="/booking" element={
          <QuickBooking
            movie={movie} // 영화 목록을 전달
            setSelectedMovie={setSelectedMovie} // 선택한 영화를 설정하는 함수를 전달
            setSelectedDate={setSelectedDate} // 선택한 날짜를 설정하는 함수를 전달
            setSelectedTime={setSelectedTime} // 선택한 시간을 설정하는 함수를 전달
            selectedMovie={selectedMovie} // 선택한 영화를 전달
            selectedDate={selectedDate} // 선택한 날짜를 전달
            selectedTime={selectedTime} // 선택한 시간을 전달
          />
        } />
        <Route path="/seat-booking" element={
          <SeatBooking
            movieId={movieId}
            movie={movie} // 영화 목록을 전달
            selectedMovie={selectedMovie} // 선택한 영화를 전달
            selectedDate={selectedDate} // 선택한 날짜를 전달
            selectedTime={selectedTime} // 선택한 시간을 전달
            selectedSeats={selectedSeats} // 선택한 좌석들을 전달
            setSelectedSeats={setSelectedSeats} // 선택한 좌석들을 설정하는 함수를 전달
          />
        } />
        <Route path="/payment" element={<PaymentPage />} /> 
        <Route path="/reservations" element={<Reservations />} /> 

        {/*-------------------kth-------------------------*/}
        <Route path="/" element={<Main />} />
          <Route path="/signup" element={<Signup />} /> {/* 회원가입 - kwj */}
          <Route path="/Login" element={<Login />}></Route> {/* 로그인 - kth */}
          <Route path="/Mypage" element={<Mypage />}></Route> {/* 마이페이지 - kth */}
      </Routes>
    </Router>

    </div>

  );
};

export default App; // App 컴포넌트를 내보내서 다른 파일에서 사용할 수 있게함
