import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import styled from "styled-components";
import IconButton from "./IconButton";
import Logout from "./Logout";
import { UserCircle, UploadCloud, FolderOpen } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <Nav>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="EVault Logo" className="logo-img" />
          EVault
        </Link>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <Link to="/fileupload" className="nav-item">
              <IconButton
                icon={<UploadCloud size={25} strokeWidth={2} color="white" />}
                iconName={"Upload File"}
              />
            </Link>
            <Link to="/viewfiles" className="nav-item">
              <IconButton
                icon={<FolderOpen size={25} strokeWidth={2} color="white" />}
                iconName={"Your Files"}
              />
            </Link>
            <Link to="/profile" className="nav-item">
              <IconButton
                icon={<UserCircle size={25} strokeWidth={2} color="white" />}
                iconName={"Profile"}
              />
            </Link>
            <Logout onClick={handleLogout} />
          </>
        ) : (
          <>
            <Link to="/login" className="auth-button">
              Login
            </Link>
            <Link to="/register" className="auth-button">
              Register
            </Link>
          </>
        )}
      </div>
    </Nav>
  );
};

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #000;
  height: 60px;
  color: white;
  z-index: 1000;

  .logo {
    display: flex;
    align-items: center;
  }

  .logo a {
    font-size: 2em;
    font-weight: bold;
    text-decoration: none;
    color: white;
    display: flex;
    align-items: center;
  }

  .logo-img {
    width: 80px; /* Adjust size as needed */
    height: auto;
    margin-right: 10px; /* Adds space between logo and text */
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-right: 30px;
  }

  .nav-item {
    text-decoration: none;
    color: white;
    font-size: 1em;
    font-weight: 500;
    transition: 0.3s;
  }

  .nav-item:hover {
    color: #f39c12;
  }

  .auth-button {
    padding: 8px 16px;
    border: 2px solid #ffffff;
    border-radius: 5px;
    font-size: 1em;
    font-weight: bold;
    text-decoration: none;
    color: #ffffff;
    background: transparent;
    transition: all 0.3s ease-in-out;
    margin-right: 10px;
  }

  .auth-button:hover {
    background: #ffffff;
    color: black;
  }
`;

export default Navbar;
