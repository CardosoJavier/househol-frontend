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

type ProjectContextType = {
  projects: ProjectResponse[] | null;
  isFetching: boolean;
  refreshProjects: () => Promise<void>;
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

  // On mount, use cache if available, otherwise fetch
  useEffect(() => {
    if (cacheRef.current) {
      setProjects(cacheRef.current);
    } else {
      refreshProjects();
    }
  }, [refreshProjects]);

  return (
    <ProjectContext.Provider value={{ projects, isFetching, refreshProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};
