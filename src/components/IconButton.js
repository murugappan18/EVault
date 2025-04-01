import React from "react";
import styled from "styled-components";

const IconButton = ({ icon, iconName }) => {
  return (
    <StyledWrapper>
      <button className="Btn">
        <div className="sign">{icon}</div>
        <div className="text">{iconName}</div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.4s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    background: #000;
  }

  .sign {
    transition-duration: 0.4s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: #ecf0f1;
    font-size: 1.2em;
    font-weight: 600;
    transition-duration: 0.4s;
    white-space: nowrap;
    overflow: hidden;
  }

  .Btn:hover {
    width: 150px;
    border-radius: 20px;
    gap: 20px;
    background: #000;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.4s;
    padding-left: 12px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 60%;
    transition-duration: 0.4s;
    padding-right: 10px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.2);
  }
`;

export default IconButton;