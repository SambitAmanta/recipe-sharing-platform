import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./store";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-right" />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./store/authSlice";
import AppRoutes from "./routes"; // We'll create this next

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Try to load user data if there's a token
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
