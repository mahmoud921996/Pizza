import React, { Fragment } from "react";
import Footer from "./Footer";
import NavBar from "./Navbar";
const Layout = ({ children }) => {
  return (
    <Fragment>
      <NavBar />
      {children}
      <Footer />
    </Fragment>
  );
};

export default Layout;
