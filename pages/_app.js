import { Provider } from "react-redux";
import Layout from "../components/Layout.js";
import "../styles/globals.css";
import store from "../store/store";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
