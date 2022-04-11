import { useState } from "react";
import Image from "next/image";
import styles from "../../styles/product.module.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { cartActions } from "../../store/cartSlice";
const Product = ({ pizza }) => {
  const dispatch = useDispatch();
  const [price, setPrice] = useState(pizza.prices[0]);
  const [size, setSize] = useState(0);
  const [extras, setExtras] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const handleSize = sizeIndex => {
    const difference = pizza.prices[sizeIndex] - pizza.prices[size];
    setSize(sizeIndex);
    changePrice(difference);
  };
  const changePrice = number => {
    setPrice(price + number);
  };
  const handleChange = (e, option) => {
    const checked = e.target.checked;
    if (checked) {
      changePrice(option.price);
      setExtras(prev => [...prev, option]);
    } else {
      changePrice(-option.price);
      setExtras(extras.filter(extra => extra._id !== option._id));
    }
  };

  const handleClick = () => {
    dispatch(cartActions.addProduct({ ...pizza, quantity, price, extras }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imgContainer}>
          <Image src={pizza.img} alt="" layout="fill" objectFit="contain" />
        </div>
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>{pizza.title}</h1>
        <span className={styles.price}>${price}</span>
        <p className={styles.desc}>{pizza.desc}</p>
        <h3 className={styles.choose}>Choose the Size</h3>
        <div className={styles.sizes}>
          <div className={styles.size} onClick={() => handleSize(0)}>
            <Image src="/img/size.png" alt="" layout="fill" />
            <span className={styles.number}>Small</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(1)}>
            <Image src="/img/size.png" alt="" layout="fill" />
            <span className={styles.number}>Medium</span>
          </div>
          <div className={styles.size} onClick={() => handleSize(2)}>
            <Image src="/img/size.png" alt="" layout="fill" />
            <span className={styles.number}>Large</span>
          </div>
        </div>
        <h3 className={styles.choose}>Choose additional ingredients</h3>
        <div className={styles.ingredients}>
          {pizza.extraOptions.map(opt => (
            <div className={styles.option} key={opt._id}>
              <input
                type="checkbox"
                id={opt.title}
                name={opt.title}
                className={styles.checkbox}
                onChange={e => handleChange(e, opt)}
              />
              <label htmlFor={opt.title}>{opt.title}</label>
            </div>
          ))}
        </div>
        <div className={styles.add}>
          <input
            type="number"
            className={styles.quantity}
            onChange={e => setQuantity(e.target.value)}
            value={quantity}
            min={1}
          />
          <button className={styles.button} onClick={handleClick}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const res = await axios.get(
    `http://localhost:3000/api/products/${params.id}`
  );
  return {
    props: {
      pizza: res.data,
    },
  };
};

export default Product;
