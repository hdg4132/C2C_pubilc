import './common.css';

const Subbanner=()=>{
    const pageName = 'sub_movie';
    return(
        <div className={['sub_banner', pageName].join(' ')}>
            <div className="container_fix">
                <h2 className="sub_tt">요즘 영화</h2>
                <p>최근 개봉작과 개봉 예정작을 만나보세요.</p>
            </div>
        </div>
    )
}

export default Subbanner;