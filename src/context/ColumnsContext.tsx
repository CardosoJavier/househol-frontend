import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { StatusColumnProps } from "../models";
import { getAllStatusColumns } from "../api";
import { getColumnsByProjectId } from "../api/columns/getStatusColumnsByProjectId";

type ColumnsContextType = {
  columns: StatusColumnProps[];
  setColumns: React.Dispatch<React.SetStateAction<StatusColumnProps[]>>;
  isFetching: boolean;
  fetchColumns: () => Promise<void>;
  projectId: string | null;
  setProjectId: (id: string) => void;
};

const ColumnsContext = createContext<ColumnsContextType | null>(null);

export function ColumnsProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<StatusColumnProps[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  const fetchColumns = useCallback(
    async (id?: string) => {
      const pid = id ?? projectId;
      if (!pid) return;
      setIsFetching(true);
      const data = await getColumnsByProjectId(pid);
      setColumns(data);
      setIsFetching(false);
    },
    [projectId]
  );

  useEffect(() => {
    if (projectId) {
      fetchColumns(projectId);
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
