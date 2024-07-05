import img from '../assets/logo.png'
import facebook from '../assets/facebook.png'
import instagram from '../assets/instagram.png'
import youtube from '../assets/youtube.png'
import "./Footer.css"

const Footer=()=>{
    return(
        <footer>
            <div className="container_fix">
            <ul className="link">
                <li><a href="">개인정보처리방침</a></li>
                <li><a href="">이메일무단수집거부</a></li>
            </ul>
            <div className="footer">
                <div className="logo">
                    <img src={img} alt="C2C" />
                </div>
                <div className="homepage_info">
                    <p>Come 2 Cinema</p>
                    <p>제작: 강원준, 김지홍, 김태형, 신진희, 조혜린, 한만서</p>
                </div>
            </div>
            <div className="last">
                <p>COPYRIGHTS&copy;2024 C2C. ALL RIGHTS RESERVED.</p>
                <ul className="sns">
                    <li><a href=""><img src={facebook} alt="" /></a></li>
                    <li><a href=""><img src={instagram} alt="" /></a></li>
                    <li><a href=""><img src={youtube} alt="" /></a></li>
                </ul>
            </div>
            </div>
        </footer>
    )
}

export default Footer