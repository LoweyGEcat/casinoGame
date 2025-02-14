"use client";

import React from "react";
import { useState } from "react";

export const MeepMeepModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    document.body.classList.add("modal-active");
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.classList.remove("modal-active");
  };

  return (
    <>
      <div className="content">
        <h1>Meep Meep Modal Animation</h1>
        <div className="buttons">
          <div className="button" onClick={openModal}>
            Meep Meep
          </div>
        </div>
      </div>
      <div
        id="modal-container"
        className={isOpen ? "five" : ""}
        onClick={closeModal}
      >
        <div className="modal-background">
          <div className="modal">
            <h2>I'm a Modal</h2>
            <p>Hear me roar.</p>
            <svg
              className="modal-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
            >
              <rect
                x="0"
                y="0"
                fill="none"
                width="226"
                height="162"
                rx="3"
                ry="3"
              ></rect>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};
