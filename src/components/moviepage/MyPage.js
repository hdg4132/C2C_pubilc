import React, { useState } from "react";
import Pagination from './Paging.jsx'
import TopButton from './TopButton.jsx';
import "./MyPage.css"

function MyPage() {
    const Server_URL = process.env.REACT_APP_Server_Side_Address;
    const [currentPage, setCurrentPage] = useState(1);
    const [showPopup, setShowPopup] = useState(false); // 팝업 상태 변수 추가
    const itemsPerPage = 10;

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const images = [
        "/movieImage1.jpg",
        "/movieImage2.jpg",
        "/movieImage3.jpg",
        "/movieImage4.jpg",
    ];

    return (
        <div>
            <div className="subBanner_mypage">
                <div className="container_fix">
                    <h2 className="Banner_text page">마이페이지</h2>
                    <p className="Banner_text sub">Come 2 Cinema와 함께해요</p>
                </div>
            </div>
            <div className="mypage">
                <div className="mypage_header">
                    <p className="mypage_text">마이페이지</p>
                    <div className="Line3">
                    </div>
                </div>
                <div className="mypage_side">
                    <div className="sidebox">
                        <ul className="sidebox_List">
                            <li className="sidebox_text">나의 예매내역</li>
                            <li className="sidebox_text">회원정보수정</li>
                            <li className="sidebox_text">
                                <button className="sidebox_quitbutton" onClick={() => setShowPopup(true)}>탈퇴하기</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="MyTicketing">
                    <h3>나의 예매내역</h3>
                    <div className="post_line" />
                    <div className="movie_info">
                        <div className="movieImage" style={{ backgroundImage: `url(${images[currentPage - 1]})` }} />
                        <div className="info_text">
                            <p className="movie_text1">영화명이 노출됩니다.</p>
                            <p className="movie_text2">1관 17:00 | A열 13번</p>
                            <p className="movie_text3">14,000원 (1매)</p>
                        </div>
                    </div>
                    <div className="post_line" />
                    <div className="movie_info">
                        <div className="movieImage" style={{ backgroundImage: `url(${images[currentPage - 1]})` }} />
                        <div className="info_text">
                            <p className="movie_text1">영화명이 노출됩니다.</p>
                            <p className="movie_text2">1관 17:00 | A열 13번</p>
                            <p className="movie_text3">14,000원 (1매)</p>
                        </div>
                    </div>
                    <div className="post_line" />
                    <div className="movie_info">
                        <div className="movieImage" style={{ backgroundImage: `url(${images[currentPage - 1]})` }} />
                        <div className="info_text">
                            <p className="movie_text1">영화명이 노출됩니다.</p>
                            <p className="movie_text2">1관 17:00 | A열 13번</p>
                            <p className="movie_text3">14,000원 (1매)</p>
                        </div>
                    </div>
                    <div className="post_line" />
                    <div className="movie_info">
                        <div className="movieImage" style={{ backgroundImage: `url(${images[currentPage - 1]})` }} />
                        <div className="info_text">
                            <p className="movie_text1">영화명이 노출됩니다.</p>
                            <p className="movie_text2">1관 17:00 | A열 13번</p>
                            <p className="movie_text3">14,000원 (1매)</p>
                        </div>
                    </div>
                    <div className="post_line" />
                    <div>
                        <Pagination
                            totalItems={100}
                            itemsPerPage={itemsPerPage}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            </div>
            <div style={{ height: '1000px' }}>
             <TopButton />
           </div>
           {showPopup && (
               <div className="popup show">
                   <p>탈퇴 완료했습니다.</p>
                   <button onClick={() => setShowPopup(false)}>확인</button>
               </div>
           )}
        </div>
    );
};

export default MyPage;
