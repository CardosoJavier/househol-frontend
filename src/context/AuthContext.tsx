import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PersonalInfo } from "../models";
import { getPersonalInfo, signIn, signOut } from "../api";
import { isSuccessfulSignInResponse, supabase } from "../utils";
import { AuthError } from "@supabase/supabase-js";
import { useNavigate } from "react-router";
import { showToast } from "../components/notifications/CustomToast";
import { GENERIC_ERROR_MESSAGES, handleError } from "../constants";

type AuthContextType = {
  isFetching: boolean;
  personalInfo: PersonalInfo | null;
  invalidateCache: () => void;
  refreshPersonalInfo: () => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const personalInfoCacheRef = useRef<PersonalInfo | null>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const navigate = useNavigate();

  /**
   * Invalidates the cached personal information by setting the cache reference to null.
   * This forces the cache to be refreshed the next time personal information is requested.
   */
  function invalidateCache(): void {
    personalInfoCacheRef.current = null;
  }

  /**
   * Fetches the personal information of the current user,
   * either from cache or by making a network request.
   *
   * @param forceFetch - If true, forces a network request to fetch personal info even if cached data exists.
   * @returns {Promise<void>} Resolves when the personal info has been fetched and state updated.
   *
   */
  const fetchPersonalInfo = useCallback(async (forceFetch: boolean) => {
    setIsFetching(true);

    if (!forceFetch && personalInfoCacheRef.current !== null) {
      setPersonalInfo(personalInfoCacheRef.current);
      setIsFetching(false);
      return;
    }

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) return;

      const fetchedPersonalInfo: PersonalInfo | null = await getPersonalInfo();
      personalInfoCacheRef.current = fetchedPersonalInfo;
      setPersonalInfo(fetchedPersonalInfo);
    } finally {
      setIsFetching(false);
    }
  }, []);

  /**
   * Refreshes personal information by invalidating cache and forcing a refetch.
   * This ensures the UI is updated with the latest data immediately.
   */
  const refreshPersonalInfo = useCallback(async (): Promise<void> => {
    invalidateCache();
    await fetchPersonalInfo(true);
  }, [fetchPersonalInfo]);

  /**
   * Handles user login by attempting to sign in with the provided email and password.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves when the login process is complete.
   */
  const logIn = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        setIsFetching(true);

        const loginResponse = await signIn(email, password);

        if (loginResponse instanceof AuthError) {
          const errorMessage = handleError(
            loginResponse,
            GENERIC_ERROR_MESSAGES.AUTH_SIGNIN_FAILED
          );
          showToast(errorMessage, "error");
          if (loginResponse.message === "Email not confirmed") {
            navigate("/auth/verify-email");
          }
          return;
        }

        if (isSuccessfulSignInResponse(loginResponse)) {
          await fetchPersonalInfo(true);
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = handleError(
          error,
          GENERIC_ERROR_MESSAGES.AUTH_SIGNIN_FAILED
        );
        showToast(errorMessage, "error");
      } finally {
        setIsFetching(false);
      }
    },
    [navigate]
  );

  /**
   * Logs out the current user by signing out from Supabase authentication,
   * invalidating cached data, clearing personal information, and navigating to the login page.
   * Handles errors by logging them and throwing a new error with a user-friendly message.
   * Ensures the fetching state is properly set during the process.
   *
   * @returns {Promise<void>} A promise that resolves when the logout process is complete.
   */
  const logOut = useCallback(async (): Promise<void> => {
    try {
      setIsFetching(true);
      const success = await signOut();

      if (!success) {
        // If signOut returns false, there was an error that wasn't handled gracefully
        throw new Error("Failed to log out. Please try again.");
      }

      invalidateCache();
      setPersonalInfo(null);

      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Failed to log out. Please try again.");
    } finally {
      setIsFetching(false);
    }
  }, [navigate, invalidateCache]);

  useEffect(() => {
    fetchPersonalInfo(false);
  }, [fetchPersonalInfo]);

  return (
    <AuthContext.Provider
      value={{
        isFetching,
        personalInfo,
        invalidateCache,
        refreshPersonalInfo,
        logIn,
        logOut,
      }}
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
