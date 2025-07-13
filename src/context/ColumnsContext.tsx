import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StatusColumnProps } from "../models";
import { getColumnsByProjectId } from "../api/columns/getStatusColumnsByProjectId";

type ColumnsContextType = {
  columns: StatusColumnProps[];
  setColumns: React.Dispatch<React.SetStateAction<StatusColumnProps[]>>;
  isFetching: boolean;
  fetchColumns: (force?: boolean) => Promise<void>;
  projectId: string | null;
  setProjectId: (id: string) => void;
  invalidateCache: () => void;
  error: string | null;
};

const ColumnsContext = createContext<ColumnsContextType | null>(null);

export function ColumnsProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<StatusColumnProps[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // In-memory cache for columns per project
  const cacheRef = useRef<{ [key: string]: StatusColumnProps[] }>({});

  // Invalidate cache for current project
  const invalidateCache = useCallback(() => {
    if (projectId) {
      delete cacheRef.current[projectId];
    }
  }, [projectId]);

  // Fetch columns, use cache unless forced
  const fetchColumns = useCallback(
    async (forceFetch = false) => {
      if (!projectId) return;
      setIsFetching(true);
      setError(null);

      if (!forceFetch && cacheRef.current[projectId]) {
        setColumns(cacheRef.current[projectId]);
        setIsFetching(false);
        return;
      }

      try {
        const data = await getColumnsByProjectId(projectId);
        setColumns(data);
        cacheRef.current[projectId] = data;
      } catch (err) {
        setError("Failed to fetch columns");
      } finally {
        setIsFetching(false);
      }
    },
    [projectId]
  );

  // Refetch on projectId change or reload
  useEffect(() => {
    if (projectId) {
      fetchColumns(false);
    }
  }, [projectId, fetchColumns]);

  return (
    <ColumnsContext.Provider
      value={{
        columns,
        setColumns,
        isFetching,
        fetchColumns,
        projectId,
        setProjectId,
        invalidateCache,
        error,
      }}
    >
      {children}
    </ColumnsContext.Provider>
  );
}

export function useColumns() {
  const context = useContext(ColumnsContext);

  if (!context) {
    throw new Error("useColumns must be used within an ColumnsProvider");
  }
  return context;
}
