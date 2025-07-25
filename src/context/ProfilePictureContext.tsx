import { createContext, useContext, useState, useCallback } from "react";

type ProfilePictureContextType = {
  isRefreshingProfilePicture: boolean;
  setProfilePictureRefreshing: (isRefreshing: boolean) => void;
};

const ProfilePictureContext = createContext<ProfilePictureContextType | null>(
  null
);

export const ProfilePictureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isRefreshingProfilePicture, setIsRefreshingProfilePicture] =
    useState(false);

  const setProfilePictureRefreshing = useCallback((isRefreshing: boolean) => {
    setIsRefreshingProfilePicture(isRefreshing);
  }, []);

  return (
    <ProfilePictureContext.Provider
      value={{
        isRefreshingProfilePicture,
        setProfilePictureRefreshing,
      }}
    >
      {children}
    </ProfilePictureContext.Provider>
  );
};

export const useProfilePicture = () => {
  const context = useContext(ProfilePictureContext);
  if (!context) {
    throw new Error(
      "useProfilePicture must be used within a ProfilePictureProvider"
    );
  }
  return context;
};
