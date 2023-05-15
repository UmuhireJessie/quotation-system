import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import logo from "../../assets/images/biglogo.png";
import Image from "next/image";
import styles from './signup.module.css'
import { useState } from "react";


const SignUp = () => {

  const [firstName, setFirstName] = useState<string>();
  const onChangeFirstName = (e: any) => {
    setFirstName(e.target.value);
  };
  const [lastName, setLastName] = useState<string>("");
  const onChangeLastName = (e: any) => {
    setLastName(e.target.value);
  };
  const [email, setEmail] = useState<string>("");
  const onChangeEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const [pNumber, setPNumber] = useState<string>("");
  const onChangePNumber = (e: any) => {
    setPNumber(e.target.value);
  };
  const [password, setPassword] = useState<string>("");
  const onChangePassword = (e: any) => {
    setPassword(e.target.value);
  };
  const [role, setRole] = useState<string>("");
  const onChangeRole = (e: any) => {
    setRole(e.target.value);
  };


  const createUser = async (data: any) => {
    try {
      const dt = await fetch("http://178.79.172.122:5000/auth/registration", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await dt.json();
      console.log("response", response)
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault()
    const regData = {
      email: email,
      pNnumber: pNumber,
      first_name: firstName,
      last_name: lastName,
      password: password,
      role: role
    };
    createUser(regData);

    console.log("send ")
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRole("");
    setPNumber("")
    e.preventDefault();

    // console.log(regData)

  };

  return (
    <div>
      <Navbar />

      <div className={styles.signupCard}>
        <div className={styles.signupCardLeft}>
          <Image className={styles.img} src={logo} alt="Logo" />
          <h2>WELCOME TO </h2>
          <h2>QUOTATION MANAGEMENT </h2>
          <h2>SYSTEM</h2>
        </div>
        <div className={styles.signupCardRight}>
          <div className={styles.signupCardRChild}>
            <h3>Create New Account</h3>
            <form className={styles.form}>
              <div className={styles.formField}>
                <input type="text" id="firstName" value={firstName} onChange={onChangeFirstName} placeholder="First Name" name="firstName" required />
              </div>
              <div className={styles.formField}>
                <input type="text" id="lastName" value={lastName} onChange={onChangeLastName} placeholder="Last Name" name="lastName" required />
              </div>
              <div className={styles.formField}>
                <input type="email" id="email" value={email} onChange={onChangeEmail} placeholder="Email" name="email" required />
              </div>
              <div className={styles.formField}>
                <input type="text" id="phoneNumber" value={pNumber} onChange={onChangePNumber} placeholder="Phone Number" name="phoneNumber" required />
              </div>
              <div className={styles.formField}>
                <input type="text" id="role" value={role} onChange={onChangeRole} placeholder="Role" name="role" required />
              </div>
              <div className={styles.formField}>
                <input type="password" id="password" value={password} onChange={onChangePassword} placeholder="Password" name="password" required />
              </div>
              <p>
                Have an account already? <a href="/">Sign in</a>
              </p>
            </form>
          </div>
          <button className={styles.buttonSubmit}  onClick={onSubmit} type="submit">SIGN UP</button>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default SignUp;
