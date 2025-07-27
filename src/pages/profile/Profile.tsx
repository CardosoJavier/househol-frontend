import { useState } from "react";
import {
  PageLayout,
  CustomLabel,
  CustomInput,
  GroupContainer,
} from "../../components";
import { useAuth } from "../../context";
import ProfilePictureModal from "../../components/util/ProfilePictureModal";
import CustomButton from "../../components/input/customButton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Profile() {
  const { personalInfo, isFetching } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {isFetching ? (
          <Skeleton height={32} width={200} />
        ) : (
          <h1 className="text-2xl font-semibold">Profile Settings</h1>
        )}
        <div className="flex flex-col justify-center items-center">
          {/* Personal information */}
          <div id="personal-info" className="space-y-3 w-full max-w-4xl">
            {isFetching ? (
              <Skeleton height={24} width={150} />
            ) : (
              <h2 className="text-lg font-medium">Personal Info</h2>
            )}
            <GroupContainer>
              <form className="flex flex-col md:flex-row gap-4 p-4 justify-around items-center">
                {/* Profile picture */}
                <div className="flex flex-col gap-3 w-full max-w-md md:w-1/3 justify-center items-center">
                  {isFetching ? (
                    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                      <Skeleton height={112} width={112} circle />
                    </SkeletonTheme>
                  ) : (
                    <img
                      className="w-24 h-24 md:w-28 md:h-28 duration-300 ease-linear rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      src={personalInfo?.profilePictureUrl}
                      alt="profile pic"
                      onClick={handleOpenModal}
                    />
                  )}
                  {isFetching ? (
                    <Skeleton height={32} width={100} />
                  ) : (
                    <CustomButton
                      type="button"
                      label="Update Photo"
                      onClick={handleOpenModal}
                      textSize="sm"
                    />
                  )}
                </div>
                {/* Data */}
                <div className="flex flex-col gap-3 w-full max-w-md md:w-2/4">
                  {isFetching ? (
                    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                      <div>
                        <Skeleton height={16} width={60} className="mb-2" />
                        <Skeleton height={40} width="100%" />
                      </div>
                      <div>
                        <Skeleton height={16} width={80} className="mb-2" />
                        <Skeleton height={40} width="100%" />
                      </div>
                      <div>
                        <Skeleton height={16} width={50} className="mb-2" />
                        <Skeleton height={40} width="100%" />
                      </div>
                    </SkeletonTheme>
                  ) : (
                    <>
                      <div>
                        <CustomLabel label="Name" forItem="name" />
                        <CustomInput
                          placeholder="Name"
                          type="text"
                          name="name"
                          id="name"
                          isDisabled={true}
                          value={personalInfo?.firstName ?? ""}
                        />
                      </div>
                      <div>
                        <CustomLabel label="Last Name" forItem="lastName" />
                        <CustomInput
                          placeholder="Last Name"
                          type="text"
                          name="lastName"
                          id="lastName"
                          isDisabled={true}
                          value={personalInfo?.lastName ?? ""}
                        />
                      </div>
                      <div>
                        <CustomLabel label="Email" forItem="email" />
                        <CustomInput
                          placeholder="Email"
                          type="email"
                          name="email"
                          id="email"
                          value={personalInfo?.email}
                          isDisabled={true}
                        />
                      </div>
                    </>
                  )}
                </div>
              </form>
            </GroupContainer>
          </div>
        </div>
      </div>

      {/* Profile Picture Upload Modal */}
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentProfilePictureUrl={personalInfo?.profilePictureUrl}
      />
    </PageLayout>
  );
}
