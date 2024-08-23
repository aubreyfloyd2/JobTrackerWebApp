import { Route, Routes } from "react-router-dom";
import { Login, Signup, Home, Jobs, Contacts, Skills } from "./pages";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
