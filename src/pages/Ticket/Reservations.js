import axios from 'axios'; // 서버에 요청을 보내는 도구를 가져옴
import React, { useEffect, useState } from 'react'; // React에서 필요한 기능들을 가져옴

const Reservations = () => {
  const [reservations, setReservations] = useState([]); // 예매 목록을 저장할 공간을 만듬

  useEffect(() => { // 컴포넌트가 화면에 처음 나타날 때 실행되는 부분
    axios.get('http://localhost:5000/reservations') // 서버에서 예매 목록 데이터를 가져옴
      .then(response => { // 서버에서 데이터를 성공적으로 가져왔을 때 실행
        setReservations(response.data); // 가져온 예매 목록 데이터를 state에 저장
      })
      .catch(error => { // 서버에서 데이터를 가져오는 중에 에러가 발생했을 때 실행
        console.error('There was an error fetching the reservations!', error); // 에러 메시지를 콘솔에 출력
      });
  }, []); // 빈 배열을 넣어줘서 컴포넌트가 처음 나타날 때만 실행

  return (
    <div>
      <h2>예매 목록</h2> {/*예매 목록 제목*/}
      <ul>
        {reservations.map(reservation => ( // 예매 목록을 하나씩 화면에 표시
          <li key={reservation.rs_num}> {/* 각각의 예매를 구분하기 위한 고유 번호*/}
            {reservation.mv_no} - {reservation.rs_datetime} {/* 영화 번호와 예매 시간을 표시*/}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservations; // Reservations 컴포넌트를 내보내서 다른 파일에서 사용할 수 있게 함
