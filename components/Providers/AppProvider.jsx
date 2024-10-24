"use client";

import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [section, setSection] = useState(2);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [fromAssets, setFromAssets] = useState({
    fromChain: "11155111",
    fromToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    fromAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    fromAmount: "",
    decimals: 8,
  });
  const [toAssets, setToAssets] = useState({
    toChain: "421613",
    toToken: "",
    toAddress: "",
    toAmount: "",
  });

  const values = {
    section,
    setSection,
    isCollapsed,
    setIsCollapsed,
    fromAssets,
    setFromAssets,
    toAssets,
    setToAssets,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
