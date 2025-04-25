// src/components/Layout/index.js
import Head from "next/head";
import React from "react";

/**
 * Layout component for the application.
 */
const Layout = ({ children }) => {
  return (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="row">{children}</div>
    </div>
  );
};

export default Layout;
