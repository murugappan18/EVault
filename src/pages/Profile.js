import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FaUserCircle } from "react-icons/fa";

const Profile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        if (user) {
          const userRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } 
          else {
            console.error("No such document!");
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("GetUserDetails Error: ", err);
      }
    };
    getUserDetails();
  }, [user]);

  return (
    <div>
      <Navbar user={user} />
      <div className="profile-container">
        {isLoading ? (
          <Loader />
        ) : userData ? (
          <div className="profile-card">
            <div className="profile-header">
              <FaUserCircle className="profile-avatar" />{" "}
              {/* Default Icon Avatar */}
              <h2>
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="user-role">{userData.userType}</p>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{userData.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">User Type:</span>
                <span className="value">{userData.userType}</span>
              </div>
            </div>
          </div>
        ) : (
          <p>No user data found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
