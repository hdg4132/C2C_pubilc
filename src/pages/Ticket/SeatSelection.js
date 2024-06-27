import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Ticket/Ticket.css';

const SeatSelection = ({
  selectedPeople, // 선택한 사람 수를 나타냄
  selectedSeats, // 선택한 좌석들을 나타냄
  setSelectedSeats, // 선택한 좌석들을 설정하는 함수
  reservedSeat // 예약된 좌석들을 나타냄
}) => {
  const handleSeatClick = (seat) => { // 좌석을 클릭했을 때 실행되는 함수
    if (selectedSeats.includes(seat)) { // 이미 선택한 좌석을 다시 클릭하면 선택을 취소
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < selectedPeople) { // 선택한 사람 수보다 적은 좌석을 선택한 경우 좌석을 추가
      setSelectedSeats([...selectedSeats, seat]);
    } else { // 선택한 사람 수보다 많은 좌석을 선택하려고 하면 경고 메시지 나옴
      alert(`최대 ${selectedPeople}개의 좌석만 선택 가능합니다.`);
    }
  };

  const SeatRow = () => { // 좌석 배열을 만드는 함수
    const seatArray = []; // 좌석을 담을 배열을 만듬
    for (let i = 65; i <= 69; i++) { // A부터 E까지의 좌석 행을 만듬
      for (let j = 1; j < 9; j++) { // 각 행에 1부터 8까지의 좌석 번호를 만듬
        const seatId = String.fromCharCode(i) + j; // 좌석 ID를 만듬 예: A1, A2 등
        var disable = false; // 좌석이 예약되었는지 여부를 나타냄

        reservedSeat.map((seat) => { // 예약된 좌석을 확인
          if (seat.seat === seatId) {
            return disable = true, console.log(seatId); // 예약된 좌석이면 disable을 true로 설정
          } else {
            return;
          }
        });
        seatArray.push( // 좌석 버튼을 배열에 추가함
          <button
            key={seatId} // 좌석 ID를 키로 사용함
            value={seatId} // 좌석 ID를 값으로 사용함
            disabled={disable === true} // 예약된 좌석은 클릭할 수 없게 함
            className={`seat available ${
              selectedSeats.includes(seatId) ? "selected" : ""
            } ${disable ? "reserved" : ""}`} // 예약된 좌석은 "reserved" 클래스를 추가
            onClick={() => handleSeatClick(seatId)} // 좌석을 클릭했을 때 handleSeatClick 함수를 실행
          >
            {seatId} {/*좌석 ID를 버튼에 표시합니다.*/}
          </button>
        );
      }
    }
    return seatArray; // 좌석 배열을 반환
  };

  return (
    <div className="seat-selection"> {/*좌석 선택 영역*/}
      <h2>좌석선택</h2> {/* 좌석 선택 제목 */}
      <div className="screen">SCREEN</div> {/* 스크린을 나타내는 부분 */}
      <div className="seats">
        <div className="row">{SeatRow()}</div> {/* 좌석 행을 표시하는 부분 */}
      </div>
    </div>
  );
};

export default SeatSelection; // SeatSelection 컴포넌트를 내보내서 다른 파일에서 사용할 수 있게함
