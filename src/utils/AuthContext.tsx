import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID, Models } from "appwrite";
import { IRegistrationCredentials } from "../pages/RegisterPage";

export interface ICredentials {
  email: string;
  password: string;
}

export interface IAuthContext {
  user: any;
  handleUserLogin: (e: any, credentials: ICredentials) => {};
  handleUserRegister: (e: any, credentials: IRegistrationCredentials) => {};
  handleUserLogout: () => {};
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (e) {
      console.warn(e);
    }
    setLoading(false);
  };

  const handleUserLogin = async (e: any, credentials: ICredentials) => {
    e.preventDefault();

    try {
      await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );

      const accountDetails = await account.get();

      setUser(accountDetails);

      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserLogout = async () => {
    account.deleteSession("current");
    setUser(null);
  };

  const handleUserRegister = async (
    e: any,
    credentials: IRegistrationCredentials
  ) => {
    e.preventDefault();
    if (credentials.password !== credentials.password2) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await account.create(
        ID.unique(),
        credentials.email,
        credentials.password,
        credentials.name
      );

      await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );
      const accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const contextData: IAuthContext = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
