import React, { useState, useEffect } from 'react'; // React에서 필요한 기능들을 가져옴
import People from './People'; // People 컴포넌트를 가져옴
import SeatSelection from './SeatSelection'; // SeatSelection 컴포넌트를 가져옴
import MovieInfo from './MovieInfo'; // MovieInfo 컴포넌트를 가져옴
import axios from "axios"; // 서버에 요청을 보내는 도구를 가져옴
import './Booking.css'; // 스타일(디자인) 파일을 가져옴

const SeatBooking = ({ movie, movieId, selectedMovie, selectedDate, selectedTime, selectedSeats, setSelectedSeats }) => {
  const [selectedPeople, setSelectedPeople] = useState(1); // 선택한 사람 수를 저장할 공간을 만듬
  const [reservedSeat, setReservedSeat] = useState([]); // 예약된 좌석들을 저장할 공간을 만듬
  useEffect(() => { // 컴포넌트가 화면에 처음 나타날 때 실행되는 부분
    async function resData() { // 비동기로 서버에서 데이터를 가져오는 함수
      const reservedSeats = await axios.get(`http://localhost:5000/seat`, { params: { // 서버에 예약된 좌석 데이터를 요청
        id: movieId,  // 영화 ID를 요청 파라미터로 보냄
        date: selectedDate, // 선택한 날짜를 요청 파라미터로 보냄
        time: selectedTime, // 선택한 시간을 요청 파라미터로 보냄
      }});
      const data = reservedSeats.data; // 서버에서 받은 데이터를 변수에 저장
      setReservedSeat(data); // 가져온 예약된 좌석 데이터를 state에 저장
    }
    resData(); // 위에서 만든 함수 resData를 실행
  }, [selectedDate, selectedTime]); // 날짜와 시간이 변경될 때마다 실행되도록 설정

  console.log(reservedSeat); // 예약된 좌석 데이터를 콘솔에 출력

  return ( // 화면에 보여줄 내용을 작성하는 부분
    <div className="booking"> {/*전체 예약 내용을 감싸는 큰 상자*/}
      <People selectedPeople={selectedPeople} setSelectedPeople={setSelectedPeople} /> {/*People 컴포넌트를 보여줌*/}
      <SeatSelection
        reservedSeat={reservedSeat} // 예약된 좌석 데이터를 전달
        selectedPeople={selectedPeople} // 선택한 사람 수를 전달
        selectedSeats={selectedSeats} // 선택한 좌석들을 전달
        setSelectedSeats={setSelectedSeats} // 선택한 좌석들을 설정하는 함수를 전달
      />
      <MovieInfo
        movie={movie} // 영화 정보를 전달
        selectedMovie={selectedMovie} // 선택한 영화를 전달
        selectedDate={selectedDate} // 선택한 날짜를 전달
        selectedTime={selectedTime} // 선택한 시간을 전달
        selectedSeats={selectedSeats} // 선택한 좌석들을 전달
      />
    </div>
  );
};

export default SeatBooking; // SeatBooking 컴포넌트를 내보내서 다른 파일에서 사용할 수 있게 함
