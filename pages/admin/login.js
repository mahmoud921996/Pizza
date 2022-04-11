import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/login.module.css";
const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      });
      router.push("/admin");
    } catch (err) {
      setError(true);
      console.log(err)
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Admin Dashboard</h1>
        <input
          className={styles.input}
          placeholder="username"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className={styles.input}
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleClick} className={styles.button}>
          Sign In
        </button>
        {error && <span className={styles.error}>Wrong Credentials</span>}
      </div>
    </div>
  );
};

export default Login;
