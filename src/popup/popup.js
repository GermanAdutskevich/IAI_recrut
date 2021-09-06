import React from "react";
import "./popup.scss";

const Popup = ({ active, setActive, children }) => {
  return (
    <div
      className={active ? "popup act" : "popup"}
      onClick={() => setActive(false)}
    >
      <div
        className={active ? "popup_content act" : "popup_content"}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
