import React from "react";
import styled from "styled-components";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <SocialLinks>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={24} />
          </a>
        </SocialLinks>
        <FooterLinks>
          <button onClick={() => alert("Coming soon!")}>Privacy Policy</button>
          <button onClick={() => alert("Coming soon!")}>Terms of Service</button>
          <button onClick={() => alert("Coming soon!")}>Contact Us</button>
          <button onClick={() => alert("Coming soon!")}>About Us</button>
        </FooterLinks>
        <p>
          Copyright &copy; {new Date().getFullYear()} EVault. All rights reserved.
        </p>
        <p>
          This Website was Developed by <strong>Murugappan P</strong>.
        </p>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: white;
  padding: 20px 0;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  h3 {
    font-size: 1.8em;
    margin-bottom: 10px;
  }

  p {
    font-size: 1em;
    margin: 5px 0px;
    padding: 6px;
  }
`;

const SocialLinks = styled.div`
  margin: 20px 0;
  a {
    color: white;
    margin: 0 10px;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #f39c12;
  }
`;

const FooterLinks = styled.div`
  margin: 20px 0;
  button {
    color: white;
    margin: 0 10px;
    text-decoration: none;
    font-size: 1em;
    transition: color 0.3s ease;
    background: none;
    border: none;
  }

  button:hover {
    color: #f39c12;
    cursor: pointer;
  }
`;

export default Footer;