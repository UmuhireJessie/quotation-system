import Cookies from "js-cookie";
import Users from "@/components/sections/User/Users";

const users = () => {
    return ( <>
    <Users />
    </>
    )
};

export async function getServerSideProps({ req, res }) {
    const token = Cookies.get("token");

    if (!token) {
        res.setHeader("location", "/");
        res.statusCode = 302;
        res.end();
        return { props: {} };
    }

    return { props: {} };
}

export default users;