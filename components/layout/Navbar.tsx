import Image from "next/image";
import logo from "../assets/images/navlogo.png"
import Link from "next/link";


interface Props{
    className: string
}

const Navbar = () => {
    return (
        <header className="m-0 h-[70px] z-50 w-full ">
            <Link href="/">
                <Image className="mt-0 ml-[50px] bg-transparent" src={logo} alt="Old Mutual" width={140} height={70} />
            </Link>
            
        </header>
    );
}

export default Navbar;