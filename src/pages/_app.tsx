import React from "react";
import { AppLayout } from "@/layout/index";
import { motion } from "framer-motion";
import "@/styles/globals.css";

function App({ Component, pageProps, ...appProps }) {
  const pageAnimationVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5 } },
  };

  const isLayoutNeeded = appProps.router.pathname.includes("/auth");

  const LayoutWrapper = !isLayoutNeeded ? AppLayout : React.Fragment;

  return (
    <LayoutWrapper>
      <motion.div
        key={appProps.router.route} // Ensure proper animation on route change
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageAnimationVariants}
      >
        <Component {...pageProps} />
      </motion.div>
    </LayoutWrapper>
  );
}

export default App;
