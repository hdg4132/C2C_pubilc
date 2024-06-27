import './common.css';

const Subbanner=({title, text, pageName})=>{
    return(
        <div className={['sub_banner', pageName].join(' ')}>
            <div className="container_fix">
                <h2 className="sub_tt">{title}</h2>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default Subbanner;