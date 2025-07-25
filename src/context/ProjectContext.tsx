import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ProjectResponse } from "../models";
import { getAllProjects } from "../api/projects/getAllProjects";
import { getProjectMembers } from "../api/projects/getProjectMembers";
import type { ProjectMember } from "../api/projects/getProjectMembers";

type ProjectContextType = {
  projects: ProjectResponse[] | null;
  isFetching: boolean;
  refreshProjects: () => Promise<void>;
  // Project members functionality
  getProjectMembersFromCache: (projectId: string) => ProjectMember[] | null;
  refreshProjectMembers: (projectId: string) => Promise<ProjectMember[] | null>;
  invalidateProjectMembersCache: (projectId?: string) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectContext = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx)
    throw new Error("useProjectContext must be used within ProjectProvider");
  return ctx;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cacheRef = useRef<ProjectResponse[] | null>(null);
  const membersCacheRef = useRef<Map<string, ProjectMember[]>>(new Map());
  const [projects, setProjects] = useState<ProjectResponse[] | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const refreshProjects = useCallback(async () => {
    setIsFetching(true);
    try {
      const fetchedProjects = await getAllProjects();
      setProjects(fetchedProjects);
      cacheRef.current = fetchedProjects;
    } finally {
      setIsFetching(false);
    }
  }, []);

  const getProjectMembersFromCache = useCallback(
    (projectId: string): ProjectMember[] | null => {
      return membersCacheRef.current.get(projectId) || null;
    },
    []
  );

  const refreshProjectMembers = useCallback(
    async (projectId: string): Promise<ProjectMember[] | null> => {
      try {
        const fetchedMembers = await getProjectMembers(projectId);
        if (fetchedMembers) {
          membersCacheRef.current.set(projectId, fetchedMembers);
        }
        return fetchedMembers;
      } catch (error) {
        console.error("Failed to fetch project members:", error);
        return null;
      }
    },
    []
  );

  const invalidateProjectMembersCache = useCallback((projectId?: string) => {
    if (projectId) {
      membersCacheRef.current.delete(projectId);
    } else {
      membersCacheRef.current.clear();
    }
  }, []);

  // On mount, use cache if available, otherwise fetch
  useEffect(() => {
    if (cacheRef.current) {
      setProjects(cacheRef.current);
    } else {
      refreshProjects();
    }
  }, [refreshProjects]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isFetching,
        refreshProjects,
        getProjectMembersFromCache,
        refreshProjectMembers,
        invalidateProjectMembersCache,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
