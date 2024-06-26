import React, { useState, useEffect } from 'react'; // React와 필요한 기능들을 가져옴
import '../Ticket/Ticket.css'; // 스타일(디자인) 파일을 가져가져옴
import axios from 'axios'; // 서버에 요청을 보내는 도구를 가져가져옴

const MovieSelection = ({ movie, onSelect, selectedMovie }) => { // MovieSelection 컴포넌트를 만듬. 영화 목록, 영화 선택 함수, 선택된 영화를 props로 받음

  return (
    <div className="movie-selection selection"> {/* 영화 선택 영역*/}
      <h4>영화</h4> {/* 영화 선택 제목*/}
      <ul>
        {movie.map((movie) => ( // 영화 목록을 하나씩 화면에 표시
          <li
            key={movie.id} // 각각의 영화를 구분하기 위한 고유 번호
            className={selectedMovie === movie.name ? 'selected' : ''} // 선택된 영화에는 'selected'라는 특별한 표시를 함
            onClick={() => onSelect(movie.name)} // 영화를 클릭하면 선택된 영화로 설정
          >
            <img src={movie.thumbnail} alt={movie.name} /> {/*영화 썸네일(작은 그림)을 보여줌*/}
            <span>{movie.name}</span> {/*영화 이름을 보여줌*/}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieSelection; // MovieSelection 컴포넌트를 내보내서 다른 파일에서 사용할 수 있게 함
