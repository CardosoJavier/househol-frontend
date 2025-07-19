import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PersonalInfo } from "../models";
import { getPersonalInfo, signIn } from "../api";
import { isSuccessfulSignInResponse, supabase } from "../utils";
import { AuthError } from "@supabase/supabase-js";
import { useNavigate } from "react-router";

type AuthContextType = {
  isFetching: boolean;
  personalInfo: PersonalInfo | null;
  loginError: AuthError | null;
  invalidateCache: () => void;
  logIn: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const personalInfoCacheRef = useRef<PersonalInfo | null>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<AuthError | null>(null);

  const navigate = useNavigate();

  function invalidateCache(): void {
    personalInfoCacheRef.current = null;
  }

  const fetchPersonalInfo = useCallback(async (forceFetch: boolean) => {
    console.log("chache: ", personalInfoCacheRef.current);
    setIsFetching(true);

    if (!forceFetch && personalInfoCacheRef.current !== null) {
      console.log("fetched from cache");
      setPersonalInfo(personalInfoCacheRef.current);
      setIsFetching(false);
      return;
    }

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) return;

      console.log("fetched from requests");
      const fetchedPersonalInfo: PersonalInfo | null = await getPersonalInfo();
      personalInfoCacheRef.current = fetchedPersonalInfo;
      setPersonalInfo(fetchedPersonalInfo);
    } finally {
      setIsFetching(false);
    }
  }, []);

  async function logIn(email: string, password: string): Promise<void> {
    try {
      setIsFetching(true);
      const loginResponse = await signIn(email, password);
      setIsFetching(false);

      if (loginResponse instanceof AuthError) {
        if (loginResponse.message === "Email not confirmed") {
          navigate("/auth/verify-email");
        }
        setLoginError(loginResponse);
      } else if (isSuccessfulSignInResponse(loginResponse)) {
        fetchPersonalInfo(true);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPersonalInfo(false);
  }, [fetchPersonalInfo]);

  return (
    <AuthContext.Provider
      value={{ isFetching, personalInfo, loginError, invalidateCache, logIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context: AuthContextType | null = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
