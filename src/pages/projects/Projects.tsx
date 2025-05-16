import { useEffect, useState } from "react";
import { getPersonalInfo } from "../../api";
import {
  CustomButton,
  Dialog,
  PageLayout,
  ProjectForm,
} from "../../components";
import { PersonalInfo } from "../../models";

export default function Projects() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [isNewProjectExpanded, setIsNewProjectExpanded] =
    useState<boolean>(false);

  async function getUserInfo() {
    const personalInfoData: PersonalInfo | null = await getPersonalInfo();
    setPersonalInfo(personalInfoData);
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  function ProjectCard() {
    return (
      <button
        className={`flex flex-col w-full max-w-xs bg-primary rounded-lg outline outline-2 outline-secondary hover:outline-accent duration-200 hover:shadow-lg hover:bg-gray-50`}
      >
        <div className="flex w-full h-fit bg-accent rounded-t-md justify-center items-center">
          <span className="text-base text-secondary font-semibold p-2">
            Project Name #1
          </span>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center w-full h-16 px-5 py-2">
          <span className="text-gray-400 font-semibold">Coming soon...</span>
          {/* <div className="flex justify-center items-center gap-2">
            <div className="bg-red-500 w-2 h-2 rounded-full"></div>
            <span>3 tasks</span>
          </div>

          <div className="flex justify-center items-center gap-2">
            <div className="bg-orange-500 w-2 h-2 rounded-full"></div>
            <span>3 tasks</span>
          </div>

          <div className="flex justify-center items-center gap-2">
            <div className="bg-blue-500 w-2 h-2 rounded-full"></div>
            <span>3 tasks</span>
          </div> */}
        </div>
        <div className="flex w-full h-8 bg-gray-100 rounded-b-md border-t-2 border-secondary justify-center items-center">
          <div className="flex justify-between items-center w-full px-5">
            <span className="text-xs">Last modified</span>
            <span className="text-xs">May 12</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="flex flex-col justify-between items-center gap-2 sm:flex-row">
          <h1 className="text-3xl font-semibold">
            Welcome back, {personalInfo?.firstName}
          </h1>
          <div className="w-72 sm:w-fit">
            <CustomButton
              label={"New Project"}
              onClick={() => setIsNewProjectExpanded(!isNewProjectExpanded)}
            />
            {isNewProjectExpanded && (
              <Dialog>
                <ProjectForm
                  onClickCancel={() =>
                    setIsNewProjectExpanded(!isNewProjectExpanded)
                  }
                />
              </Dialog>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 w-full place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ProjectCard()}
          {ProjectCard()}
          {ProjectCard()}
          {ProjectCard()}
        </div>
      </div>
    </PageLayout>
  );
}
