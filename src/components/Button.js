const Button =({text, color, onClick})=>{
    return(
        <button className={['btn_default ', `${color}`].join('')} onClick={onClick} >{text}</button>
    )
}

export default Button;