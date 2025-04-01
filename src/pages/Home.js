import { React } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Cloud, Key } from "lucide-react";
import Footer from "../components/Footer";

const Home = ({ user }) => {
  const navigate = useNavigate();
  return (
    <LandingContainer>
      <Navbar user={user} />
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-content"
        >
          <h1>Welcome to EVault</h1>
          <p>A Decentralized and Secure File Storage System</p>
          <button className="get-started" onClick={() => navigate("/login")}>Get Started</button>
        </motion.div>
      </HeroSection>
      <FeaturesSection>
        <h2>Why Choose EVault?</h2>
        <FeatureGrid>
          <FeatureCard>
            <ShieldCheck size={40} />
            <h3>Decentralized Security</h3>
            <p>Data stored securely on a decentralized blockchain network.</p>
          </FeatureCard>
          <FeatureCard>
            <Lock size={40} />
            <h3>Private & Encrypted</h3>
            <p>Ensuring data privacy with robust encryption mechanisms.</p>
          </FeatureCard>
          <FeatureCard>
            <Cloud size={40} />
            <h3>Permanent Storage</h3>
            <p>Immutable and persistent data storage on the IPFS network.</p>
          </FeatureCard>
          <FeatureCard>
            <Key size={40} />
            <h3>Easy Access</h3>
            <p>
              Access your files from anywhere, anytime with your private key.
            </p>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>
      <Footer />
    </LandingContainer>
  );
};

const LandingContainer = styled.div`
  font-family: Arial, sans-serif;
  color: white;
  background: #121212;
  min-height: 100vh;
  margin-top: 60px;
  text-align: center;
`;

const HeroSection = styled.section`
  margin-top: 0px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/assets/evault.png");
  background-repeat: no-repeat;
  background-size: auto;
  background-size: 1600px 700px;
  height: auto;
  opacity: 0;
  transform: scale(0.8);
  animation: fadeInScale 1.5s forwards;
  @keyframes fadeInScale {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .hero-content {
    align-items: center;
    align-content: center;
    margin: 20px 0;
    color: white;
    width: 100%;
    height: 100vh;
  }
  h1 {
    font-size: 70px;
    font-weight: bolder;
  }
  p {
    font-size: 20px;
    font-weight: bold;
  }
  .get-started {
    padding: 10px 20px;
    background:rgb(32, 39, 109);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.4em;
    margin-top: 20px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  .get-started:hover {
    background:rgb(17, 62, 113);
  }
`;

const FeaturesSection = styled.section`
  margin: 40px 0;
  h2 {
    font-size: 2em;
    margin-bottom: 20px;
  }
`;

const FeatureGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const FeatureCard = styled.div`
  background: #333;
  padding: 20px;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: white;
  }
`;

export default Home;