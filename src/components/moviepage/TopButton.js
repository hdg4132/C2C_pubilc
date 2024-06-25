import React, { useState, useEffect } from 'react';
import './TopButton.css';

const TopButton = () => {
  // 버튼을 보여줄지 여부를 결정하는 상태 정의
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // 스크롤 이벤트를 처리
    const handleScroll = () => {
      // 사용자가 페이지를 20픽셀 이상 스크롤했을 때 버튼 출력
      if (window.scrollY > 20) {
        setShowButton(true);
      } else {
        // 버튼 숨김처리
        setShowButton(false);
      }
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <img src="/arrow_upward_red.png" alt="arrow" className='red_arrow'/>
    </button>
  );
};

export default TopButton;
