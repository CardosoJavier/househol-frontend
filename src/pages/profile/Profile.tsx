import { useState } from "react";
import {
  PageLayout,
  CustomLabel,
  CustomInput,
  GroupContainer,
  Dialog,
} from "../../components";
import { useAuth } from "../../context";
import ProfilePictureModal from "../../components/util/ProfilePictureModal";
import CustomButton from "../../components/input/customButton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { deleteUser } from "../../api";
import { GENERIC_ERROR_MESSAGES, handleError } from "../../constants";
import { useNavigate } from "react-router";
import { MdWarning } from "react-icons/md";

export default function Profile() {
  const { personalInfo, isFetching, logOut } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUser();
      await logOut();
      navigate("/auth/login");
    } catch (error) {
      handleError(error, GENERIC_ERROR_MESSAGES.USER_DELETE_FAILED);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
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

        {/* Danger Zone */}
        <div id="danger-zone" className="space-y-3 w-full max-w-4xl mx-auto">
          {isFetching ? (
            <Skeleton height={24} width={100} />
          ) : (
            <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
          )}
          <GroupContainer>
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              {isFetching ? (
                <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                  <Skeleton height={20} width={200} className="mb-2" />
                  <Skeleton height={16} width={300} className="mb-4" />
                  <Skeleton height={40} width={120} />
                </SkeletonTheme>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <MdWarning className="text-red-600" size={20} />
                    <h3 className="text-md font-medium text-red-800">
                      Delete Account
                    </h3>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <CustomButton
                    type="button"
                    label="Delete Account"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    variant="destructive"
                    textSize="sm"
                  />
                </>
              )}
            </div>
          </GroupContainer>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <Dialog>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MdWarning className="text-red-600" size={24} />
              <h2 className="text-lg font-semibold text-red-800">
                Delete Account
              </h2>
            </div>
            <p className="text-sm text-gray-700">
              Are you sure you want to delete your account? This action cannot
              be undone and will permanently remove all your data.
            </p>
            <div className="flex gap-3 pt-4">
              <CustomButton
                type="button"
                label="Cancel"
                onClick={() => setIsDeleteDialogOpen(false)}
                variant="ghost"
                isDisabled={isDeleting}
              />
              <CustomButton
                type="button"
                label={isDeleting ? "Deleting..." : "Delete Account"}
                onClick={handleDeleteAccount}
                variant="destructive"
                loading={isDeleting}
                isDisabled={isDeleting}
              />
            </div>
          </div>
        </Dialog>
      )}

      {/* Profile Picture Upload Modal */}
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentProfilePictureUrl={personalInfo?.profilePictureUrl}
      />
    </PageLayout>
  );
}
