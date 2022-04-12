import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Cart.module.css";
import { cartActions } from "../store/cartSlice";
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/router";
import axios from "axios";
import OrderDetail from "../components/orderDetail";
const Cart = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState();
  const amount = cart.total;
  const currency = "USD";
  // const style = { layout: "vertical" };

  const createOrder = async data => {
    try {
      const res = await axios.post("/api/orders", data);
      console.log(res.data._id);
      if (res.status === 201) {
        dispatch(cartActions.reset());
        router.push("/orders/" + res.data._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Custom component to wrap the PayPalButtons and handle currency changes
  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          disabled={false}
          forceReRender={[amount, currency]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then(orderId => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;
              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1,
              });
            });
          }}
        />
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tbody>
            <tr className={styles.trTitle}>
              <th>Product</th>
              <th>Name</th>
              <th>Extras</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </tbody>
          <tbody>
            {cart.products.map(prod => (
              <tr className={styles.tr} key={prod._id}>
                <td>
                  <div className={styles.imgContainer}>
                    <Image
                      src={prod.img}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </td>
                <td>
                  <span className={styles.name}>{prod.title}</span>
                </td>
                <td>
                  <span className={styles.extras}>
                    {prod.extras.map(extra => (
                      <span key={extra._id}>{extra.title} ,</span>
                    ))}
                  </span>
                </td>
                <td>
                  <span className={styles.price}>{prod.price}</span>
                </td>
                <td>
                  <span className={styles.quantity}>{prod.quantity}</span>
                </td>
                <td>
                  <span className={styles.total}>
                    ${prod.price * prod.quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>${cart.total}
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>$0.00
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>${cart.total}
          </div>
          {open ? (
            <div className={styles.paymentMethod}>
              <button
                className={styles.payButton}
                onClick={() => setCash(true)}
              >
                CASH ON DELIVERY
              </button>
              <PayPalScriptProvider
                options={{
                  "client-id":
                    "AR-MMwoXTIcYrErj89vA66k2wmMq_8gvXnh_5VMMQsNOXwXl5bnq6-X3H_jt_uvJRSFZfsm2VO-AJyfr",
                  components: "buttons",
                  currency: "USD",
                  "disable-funding": "credit,card",
                }}
              >
                <ButtonWrapper currency={currency} showSpinner={false} />
              </PayPalScriptProvider>
            </div>
          ) : (
            <button onClick={() => setOpen(true)} className={styles.button}>
              CHECKOU NOW!
            </button>
          )}
        </div>
      </div>
      {cash && <OrderDetail total={cart.total} createOrder={createOrder} />}
    </div>
  );
};

export default Cart;
