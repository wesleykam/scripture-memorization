import "./menu.css";
import React, { useState } from "react";

const menu = () => {
  const [isSliding, setIsSliding] = useState(false);
  const handleSlide = () => {
    setIsSliding(!isSliding);
  };

  return (
    <>
      <section className={`menu-section ${isSliding ? "slide-left" : ""}`}>
        <h2>Menu</h2>
        <button className="button.game-start" onClick={handleSlide}>
          {isSliding ? "Reset" : "Start"}
        </button>
      </section>
    </>
  );
};

export default menu;
