import React, { useState } from 'react';
import './TopButton.css';

const TopButton = () => {
  // 버튼을 보여줄지 여부를 결정하는 상태 정의
  const [showButton] = useState(false);

  // 페이지를 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // 버튼을 렌더링하고, showButton 상태에 따라 'show' 클래스를 조건부로 적용
    <button
      onClick={scrollToTop}
      className={`top-button ${showButton ? 'show' : ''}`}
    >
      <img src="/arrow_upward_red.png" alt="arrow" className='red_arrow' />
    </button>
  );
};

export default TopButton;
