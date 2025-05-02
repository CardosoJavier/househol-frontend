import GroupContainer from "../../components/containers/groupContainer";
import CustomButton from "../../components/input/customButton";
import CustomInput from "../../components/input/CustomInput";
import CustomLabel from "../../components/input/CustomLabel";
import PageLayout from "../../components/layouts/PageLayout";

export default function Profile() {
  return (
    <PageLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <div className="flex flex-col justify-center items-center">
          <div id="personal-info" className="space-y-2 w-full max-w-4xl">
            <h2 className="text-2xl font-semibold">Personal Info</h2>
            <GroupContainer>
              <div className="flex gap-4 p-6 justify-around">
                {/* Profile picture */}
                <div className="flex flex-col gap-2 justify-center items-center">
                  <span className="bg-gray-400 w-28 h-28 lg:w-32 lg:h-32 duration-500 ease-linear rounded-full"></span>
                  <CustomButton label={"Update picture"} textSize="xs" />
                </div>
                {/* Data */}
                <div className="flex flex-col gap-4 w-2/4">
                  <div>
                    <CustomLabel label="Name" forItem="name" />
                    <CustomInput
                      placeholder="Name"
                      type="text"
                      name="name"
                      id="name"
                    />
                  </div>
                  <div>
                    <CustomLabel label="Last Name" forItem="name" />
                    <CustomInput
                      placeholder="Last Name"
                      type="text"
                      name="name"
                      id="name"
                    />
                  </div>
                  <div>
                    <CustomLabel label="Email" forItem="name" />
                    <CustomInput
                      placeholder="Email"
                      type="text"
                      name="name"
                      id="name"
                    />
                  </div>
                </div>
              </div>
            </GroupContainer>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
