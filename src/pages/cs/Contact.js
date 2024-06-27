import Subbanner from '../../components/Subbanner'
import KakaoMap from '../../components/KakaoMap'
import '../Movie.css'

const Contact=()=>{	

    return(
        <>
        <Subbanner title={'고객센터'} text={'무엇이든 물어보세요.'} pageName={'sub_customer'}/>
        <div className="content_wrap">
            <div className="content_header">
                <div className="container_fix clearfix">
                    <h3 className="content_tt">찾아오시는 길</h3>
               </div>
            </div>
            <div className="content_body">
                <div className="container_fix">
                    <KakaoMap/>
                    <div className="contact_wrap">
                        <div className="contact_con">
                            <h5 className="cont_tt">Come 2 Cinema</h5>
                            <p>인천 남동구 인주대로 593 엔타스 12층</p>
                        </div>
                        <div className="contact_con subway">
                            <h5 className="subway_line">인천1</h5>
                            <p>예술회관역 2번출구 직진 보도 1분</p>
                        </div>
                        <div className="contact_con">
                            <h5 className="cont_tt">Contact Us</h5>
                            <p>032) 000-0000</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content_tail">
            </div>
        </div>
        </>
    )
}

export default Contact