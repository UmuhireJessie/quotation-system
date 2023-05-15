interface Props{
    text: string,
    onClick ?: any,
    className: string
}

const Button = ({text, onClick, className}: Props) => {
    return ( 
        // <button onClick={onClick} className="bg-[#Cf1259] font-medium  shadow-xl text-white py-4 px-10 hover:bg-white hover:text-[#Cf1259] hover:scale-110 transition duration-500 ease-in-out">{text}</button>
        <button onClick={onClick} className={className}>{text}</button>
     );
}
 
export default Button;