import React, { useState, useEffect } from "react";
import Pagination from './Paging.js';
import TopButton from './TopButton.js';
import "./MyPage.css";

function MyPage() {
    const Server_URL = process.env.REACT_APP_Server_Side_Address || 'http://localhost:8000';
    const [currentPage, setCurrentPage] = useState(1);
    const [showPopup, setShowPopup] = useState(false); // 팝업 상태 변수 추가
    const [orders, setOrders] = useState([]); // 예매내역 상태 변수 추가
    const itemsPerPage = 10;

    useEffect(() => {
        // userId를 적절히 설정
        const userId = 1; // 여기에 실제 로그인한 사용자의 ID를 설정해야 합니다.
        fetch(`${Server_URL}/orders?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setOrders(data.data);
                } else {
                    console.error('orders의 에러:', data.message);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [Server_URL]);

    const onPageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const displayOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    {displayOrders.map((order) => (
                        <div key={order.id}>
                            <div className="movie_info">
                                <div className="movieImage" style={{ backgroundImage: `url(${order.imageURL})` }} />
                                <div className="info_text">
                                    <p className="movie_text1">{order.orderName}</p>
                                    <p className="movie_text2">{order.date} {order.time} | {order.seat}</p>
                                    <p className="movie_text3">{order.seatPrice}원 ({order.totalCount}매)</p>
                                </div>
                            </div>
                            <div className="post_line" />
                        </div>
                    ))}
                    <Pagination
                        totalItems={orders.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={onPageChange}
                    />
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
}

export default MyPage;
