import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import Add from "../components/Add";
import AddButton from "../components/AddButton.js";
import Featured from "../components/Featured.js";
import PizzaList from "../components/PizzaList.js";
import styles from "../styles/Home.module.css";

export default function Home({ products, admin }) {
  const [close, setClose] = useState(true);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Featured />
      {admin && <AddButton setClose={setClose} />}
      <PizzaList products={products} />
      {!close && <Add setClose={setClose} />}
    </div>
  );
}

export const getServerSideProps = async ctx => {
  const myCookie = ctx.req?.cookies || "";
  let admin = false;
  if (myCookie.token === process.env.TOKEN) {
    admin = true;
  }
  const res = await axios.get(
    `${
      process.env.NODE_ENV === "production"
        ? process.env.URL_PROD
        : process.env.URL_DEV
    }/api/products`
  );
  return {
    props: {
      products: res.data,
      admin,
    },
  };
};
