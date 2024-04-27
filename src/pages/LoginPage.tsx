import { useEffect, useState } from "react";
import { ICredentials, useAuth } from "../utils/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export interface IAppProps {}

export const LoginPage = () => {
  const { user, handleUserLogin } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<ICredentials>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handleInputChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form onSubmit={(e) => handleUserLogin(e, credentials)}>
          <div className="field--wrapper">
            <label>Email:</label>
            <input
              type="email"
              required
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="field--wrapper">
            <label>Password:</label>
            <input
              type="password"
              required
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="field--wrapper">
            <input
              className="btn btn--lg btn--main"
              type="submit"
              value="Login"
            />
          </div>
        </form>
        <p>
          Don't have an account? Register <Link to="/register">here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
