import {
  PageLayout,
  CustomLabel,
  CustomInput,
  GroupContainer,
} from "../../components";
import { useAuth } from "../../context";

export default function Profile() {
  const auth = useAuth();

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
                    src={auth.personalInfo?.profilePictureUrl}
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
    </PageLayout>
  );
}
