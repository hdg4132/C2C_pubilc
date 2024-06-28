import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

// 날짜 문자열에서 날짜 부분만 추출하는 함수
const convertDate = (dateString) => {
  const [fullDate] = dateString.split(',');
  return fullDate.trim();
};

const MovieInfo = ({ movie, selectedMovie, selectedDate, selectedTime, selectedSeats }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const location = useLocation();

  // 결제 버튼 클릭 시 실행되는 함수
  const handlePayClick = async () => {
    if (selectedSeats.length > 0) { // 선택한 좌석이 있는 경우
      try {
        const price = 14000;
        const formattedDate = convertDate(selectedDate); // 날짜 형식 변환
        const reservationData = { // 예약 데이터 생성
          selectedMovie,
          selectedDate: formattedDate,
          selectedTime,
          selectedSeats,
          price
        };
        localStorage.setItem('ticket', JSON.stringify(reservationData)); // 티켓을 로컬스토리지에 저장
      } catch (error) {
        console.error('Error making reservation:', error); // 에러 로그 출력
      }
    } else {
      alert('좌석을 선택해주세요.'); // 좌석 미선택 시 경고 메시지 출력
    }
  };

  const [moviepic, setMoviepic] = useState(''); // 영화 포스터를 저장할 state

  useEffect(() => { // 선택된 영화가 변경될 때마다 실행
    movie.map((movie) => {
      if (movie.name === selectedMovie)
        return setMoviepic(movie.thumbnail); // 선택된 영화의 썸네일 설정
    });
  }, [movie, selectedMovie]);

  return (
    <div className="movie-info"> {/* 영화 정보 표시 영역 */}
      <img src={moviepic} alt="Movie Poster" /> {/* 영화 포스터 이미지 */}
      <div className="details"> {/* 영화 상세 정보 */}
        <h3>{selectedMovie}</h3> {/* 선택된 영화 제목 */}
        <p>{selectedDate}</p> {/* 선택된 날짜 */}
        <p>{selectedTime}</p> {/* 선택된 시간 */}
        <p>{selectedSeats.join(', ')}</p> {/* 선택된 좌석 목록 */}
      </div>
      {/* <div className="price"> 총 금액 표시 영역
        <span>총 금액</span>
        <span>{selectedSeats.length * 14000} 원</span> {/* 선택된 좌석 수에 따른 총 금액 계산 
      </div> 현재 좌석 위치에따른 가격 함수로 결정하므로 결제단에서 표시*/}
      <Link to="/seat-booking/modal" state={{ background: location }} onClick={handlePayClick} className="link-pay">
      결제하기 <Outlet />
      </Link> {/* 결제 버튼 */}
    </div>
  );
};

export default MovieInfo;
