import React, { createContext, useContext, useEffect, useState } from "react";
import { StatusColumnProps } from "../models/board/StatusColumn";
import { getAllStatusColumns } from "../api/columns/getAllStatusColumn";

type ColumnsContextType = {
  columns: StatusColumnProps[];
  setColumns: React.Dispatch<React.SetStateAction<StatusColumnProps[]>>;
  isFetching: boolean;
  fetchColumns: () => Promise<void>; // Expose a function to re-fetch columns
};

const ColumnsContext = createContext<ColumnsContextType | null>(null);

export function ColumnsProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<StatusColumnProps[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchColumns = async () => {
    setIsFetching(true);
    const data = await getAllStatusColumns();
    setColumns(data);
    setIsFetching(false);
  };

  useEffect(() => {
    fetchColumns();
  }, []);

  return (
    <ColumnsContext.Provider
      value={{ columns, setColumns, isFetching, fetchColumns }}
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
