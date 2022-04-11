import styles from "../styles/orderDetail.module.css";
import { useState } from "react";
const OrderDetail = ({ total, createOrder }) => {
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");

  const handleClick = () => {
    createOrder({ customer, address, total, method: 0 });
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>You will pay $12 after delivery </h1>
        <div className={styles.item}>
          <label className={styles.label}>Name</label>
          <input
            placeholder="John Doe"
            required
            className={styles.input}
            onChange={e => setCustomer(e.target.value)}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Address</label>
          <textarea
            placeholder="13 Nile Street , California"
            required
            className={styles.textarea}
            onChange={e => setAddress(e.target.value)}
            rows={5}
            cols={20}
          ></textarea>
        </div>
        <button onClick={handleClick} className={styles.btn}>
          Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
