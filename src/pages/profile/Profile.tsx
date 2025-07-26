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

export default function Profile() {
  const auth = useAuth();
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
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <div className="flex flex-col justify-center items-center">
          {/* Personal information */}
          <div id="personal-info" className="space-y-3 w-full max-w-4xl">
            <h2 className="text-lg font-medium">Personal Info</h2>
            <GroupContainer>
              <form className="flex flex-col md:flex-row gap-4 p-4 justify-around items-center">
                {/* Profile picture */}
                <div className="flex flex-col gap-3 w-full max-w-md md:w-1/3 justify-center items-center">
                  <img
                    className="w-24 h-24 md:w-28 md:h-28 duration-300 ease-linear rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    src={auth.personalInfo?.profilePictureUrl}
                    alt="profile pic"
                    onClick={handleOpenModal}
                  />
                  <CustomButton
                    type="button"
                    label="Update Photo"
                    onClick={handleOpenModal}
                    textSize="sm"
                  />
                </div>
                {/* Data */}
                <div className="flex flex-col gap-3 w-full max-w-md md:w-2/4">
                  <div>
                    <CustomLabel label="Name" forItem="name" />
                    <CustomInput
                      placeholder="Name"
                      type="text"
                      name="name"
                      id="name"
                      isDisabled={true}
                      value={auth.personalInfo?.firstName ?? ""}
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
                      value={auth.personalInfo?.lastName ?? ""}
                    />
                  </div>
                  <div>
                    <CustomLabel label="Email" forItem="email" />
                    <CustomInput
                      placeholder="Email"
                      type="email"
                      name="email"
                      id="email"
                      value={auth.personalInfo?.email}
                      isDisabled={true}
                    />
                  </div>
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
        currentProfilePictureUrl={auth.personalInfo?.profilePictureUrl}
      />
    </PageLayout>
  );
}
