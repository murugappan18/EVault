import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FileUpload from "./pages/FileUpload";
import ViewFiles from "./pages/ViewFiles";
import Profile from "./pages/Profile";
import { auth } from "./firebase";
import Loader from "./components/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const userExist = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    });
    return () => userExist();
  }, [user]);

  if (isLoading) return <Loader />;

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/fileupload"
          element={user ? <FileUpload user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/viewfiles"
          element={user ? <ViewFiles user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/profile" /> : <Register />}
        />
        <Route
          path="/Login"
          element={user ? <Navigate to="/profile" /> : <Login />}
        />
      </Routes>
    </div>
  );
}

export default App;
