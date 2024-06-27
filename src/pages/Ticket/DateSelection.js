import React, { useState, useEffect } from 'react'; // React와 필요한 기능들을 가져옴
import '../Ticket/Ticket.css'; // 스타일(디자인) 파일을 가져옴

const dates = [ // 날짜 목록을 만듬
  { date: "24일 (금)", day: "금" },
  { date: "25일 (토)", day: "토" },
  { date: "26일 (일)", day: "일" },
  { date: "27일 (월)", day: "월" },
  { date: "28일 (화)", day: "화" },
  { date: "29일 (수)", day: "수" },
  { date: "30일 (목)", day: "목" },
  { date: "31일 (금)", day: "금" }
];

const DateSelection = ({ selectedMovie, movie, onSelect, selectedDate }) => { // DateSelection 컴포넌트를 만듬. 선택된 영화, 영화 목록, 선택 함수, 선택된 날짜를 props로 받음.

  const [startDate, setStartDate] = useState(""); // 영화 시작 날짜를 저장할 공간을 만듬
  const [endDate, setEndDate] = useState(""); // 영화 종료 날짜를 저장할 공간을 만듬
  let [date, setDate] = useState([]); // 날짜 목록을 저장할 공간을 만듬

  const getDateRange = (startDate, endDate) => { // 날짜 범위를 구하는 함수
    const start = new Date(startDate);
    const end = new Date(endDate);

    const result = [];

    while (start <= end) { // 시작 날짜부터 종료 날짜까지 반복
      result.push(start.toISOString().split('T')[0]); // 날짜를 문자열로 변환하여 배열에 추가
      start.setDate(start.getDate() + 1); // 날짜를 하루씩 증가
    }

    return result; // 날짜 범위를 반환
  }

  // 요일을 구하는 함수
  function getDayOfWeek(date) {
    const week = ['일', '월', '화', '수', '목', '금', '토']; // 요일 배열을 만듬
    const dayOfWeek = week[new Date(date).getDay()]; // 날짜 객체에서 요일을 구함
    return dayOfWeek; // 요일을 반환
  }

  useEffect(() => { // 컴포넌트가 화면에 처음 나타날 때 실행되는 부분
    console.log(movie)
    movie.map((movie) => {
      if (movie.name === selectedMovie) { // 선택한 영화와 이름이 같은 경우
        return setStartDate(movie.runStartDate), setEndDate(movie.runEndDate), console.log(movie.runStartDate); // 영화 시작 날짜와 종료 날짜를 설정
      }
    })
  }, [selectedMovie]); // 선택된 영화가 변경될 때마다 실행되도록 설정

  useEffect(() => { // 컴포넌트가 화면에 처음 나타날 때 실행되는 부분
    const dates1 = getDateRange(startDate, endDate); // 시작 날짜와 종료 날짜를 사용하여 날짜 범위를 구함
    setDate(dates1); // 구한 날짜 범위를 state에 저장
  }, [startDate]); // 시작 날짜가 변경될 때마다 실행되도록 설정

  return (
    <div className="date-selection selection"> {/* 날짜 선택 영역*/}
      <h4>상영날짜</h4> {/* 연도와 월을 표시*/}
      <ul>
        {date.map((dateObj, index) => ( // 날짜 목록을 하나씩 화면에 표시
          <li
            key={index} // 각각의 날짜를 구분하기 위한 고유 번호
            className={`
              ${selectedDate === dateObj ? 'selected' : ''} // 선택된 날짜에는 'selected'라는 특별한 표시를 합니다.
              ${getDayOfWeek(dateObj) === "토" ? 'blue-text' : ''} // 토요일에는 파란색 텍스트를 사용합니다.
              ${getDayOfWeek(dateObj) === "일" ? 'red-text' : ''} // 일요일에는 빨간색 텍스트를 사용합니다.
            `}
            onClick={() => onSelect(dateObj)} // 날짜를 클릭하면 선택된 날짜로 설정
          >
            {dateObj}, {getDayOfWeek(dateObj)} {/* 날짜와 요일을 표시*/}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DateSelection; // DateSelection 컴포넌트를 내보내서 다른 파일에서 사용할 수 있게 함
