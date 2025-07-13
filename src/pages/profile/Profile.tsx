import {
  PageLayout,
  CustomLabel,
  CustomInput,
  CustomButton,
  GroupContainer,
} from "../../components";
import profilePic from "../../assets/imgs/profile_pic.jpg";
import { useEffect, useState } from "react";
import { getPersonalInfo, getProfilePicture } from "../../api";
import { PersonalInfo } from "../../models";

export default function Profile() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");

  async function getUserInfo() {
    const personalInfoData: PersonalInfo | null = await getPersonalInfo();

    setPersonalInfo(personalInfoData);
    setNewEmail(personalInfoData?.email ?? "");

    await getProfilePicture("default");
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <PageLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <div className="flex flex-col justify-center items-center">
          {/* Personal information */}
          <div id="personal-info" className="space-y-2 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold">Personal Info</h2>
            <GroupContainer>
              <form className="flex flex-col md:flex-row gap-4 p-6 justify-around items-center">
                {/* Profile picture */}
                <div className="flex flex-col gap-2 w-full max-w-md md:w-1/3 justify-center items-center">
                  <img
                    className="w-28 h-28 md:w-32 md:h-32 duration-300 ease-linear rounded-full object-cover"
                    src={profilePic}
                    alt="profile pic"
                  />
                  <CustomLabel
                    forItem="profile-pic"
                    label="Update photo"
                    inputType="file"
                  />
                  <CustomInput
                    id="profile-pic"
                    name="profile-pic"
                    type="file"
                  />
                </div>
                {/* Data */}
                <div className="flex flex-col gap-4 w-full max-w-md md:w-2/4">
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
                    <CustomLabel label="Last Name" forItem="name" />
                    <CustomInput
                      placeholder="Last Name"
                      type="text"
                      name="name"
                      id="name"
                      isDisabled={true}
                      value={personalInfo?.lastName ?? ""}
                    />
                  </div>
                  <div>
                    <CustomLabel label="Email" forItem="name" />
                    <CustomInput
                      placeholder="Email"
                      type="email"
                      name="name"
                      id="name"
                      value={newEmail}
                      isDisabled={true}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEmail(e.target.value)
                      }
                    />
                  </div>
                  <span className="md:w-1/3 self-end">
                    <CustomButton
                      label={"Save"}
                      isDisabled={personalInfo?.email === newEmail}
                    />
                  </span>
                </div>
              </form>
            </GroupContainer>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
