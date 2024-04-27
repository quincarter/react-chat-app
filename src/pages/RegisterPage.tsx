import { useState } from "react";
import { ICredentials, useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";

export interface IRegisterPageProps {}

export interface IRegistrationCredentials extends ICredentials {
  name: string;
  password2: string;
}

export const RegisterPage = (props: IRegisterPageProps) => {
  const { handleUserRegister } = useAuth();
  const [credentials, setCredentials] = useState<IRegistrationCredentials>({
    email: "",
    name: "",
    password: "",
    password2: "",
  });

  const handleInputChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form onSubmit={(e) => handleUserRegister(e, credentials)}>
          <div className="field--wrapper">
            <label>Name:</label>
            <input
              type="text"
              required
              name="name"
              placeholder="Enter your Name"
              value={credentials.name}
              onChange={handleInputChange}
            />
          </div>
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
            <label>Confirm Password:</label>
            <input
              type="password"
              required
              name="password2"
              placeholder="Confirm your password"
              value={credentials.password2}
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
          Already have an account? Login <Link to="/login">here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
