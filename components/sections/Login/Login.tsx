import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import logo from "../../assets/images/biglogo.png"
import styles from './login.module.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/router";

const Login = () => {

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string>("");
  const onChangeEmail = (e: any) => {
    setEmail(e.target.value);
  };
  const [password, setPassword] = useState<string>("");
  const onChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const loginUser = async (data: any) => {
    try {
      const dt = await fetch("https://insurance.e-fashe.com/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await dt.json();
      const token = response.token;

      console.log("response", response)
      if (response.token) {
        setEmail("");
        setPassword("");
        setLoading(false);
        console.log(token)
        Cookies.set("token", token);
        window.location.href = "/dashboard";
      } else {
        setLoading(false);
        toast.error(response.detail);
      }

      return response;
    } catch (error: any) {
      console.error(error);
      setLoading(false)
      toast.error(error.message)
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true);
    const loginData = {
      username: email,
      password: password
    };
    console.log("loginData", loginData)
    loginUser(loginData)
  };

  const router = useRouter();

  useEffect(() => {
    const toastMessage = router.query.toast;
    toastMessage ? Array.isArray(toastMessage) ? toast.error(toastMessage.join(" ")) : toast.error(toastMessage) : null;
  }, [router.query]);

  return (
    <div>
      <Navbar />
      <Toaster
        position="top-right" />

      <div className={styles.loginCard}>
        <div className={styles.loginCardLeft}>
          <Image className={styles.img} src={logo} alt="Logo" />
          <h2>INSURANCE PAYMENTS  </h2>
          <h2>MADE EASY</h2>
        </div>
        <div className={styles.loginCardRight}>
          <div className={styles.loginCardRChild}>
            <h3>Login to your Account</h3>
            <form className={styles.form}>
              <div className={styles.formField}>
                <input type="email" id="email" value={email} onChange={onChangeEmail} placeholder="Username" name="email" required />
              </div>
              <div className={styles.formField}>
                <input type="password" id="password" value={password} onChange={onChangePassword} placeholder="Password" name="password" required />
              </div>
              <a href="/reset-password" className={styles.resetpass}>
                Forgot Password
              </a>
            </form>
          </div>
          <button
            className={" w-[200px] rounded-[30px] font-semibold text-sm text-white py-[10px] px-[20px] border-none"}
            style={{ background: "linear-gradient(270deg, #60b848 1.64%, #009677 98.36%)" }}
            onClick={onSubmit}
            type="submit"
            disabled={loading}
          >
            {loading ? "LOADING..." : "SIGN IN"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
