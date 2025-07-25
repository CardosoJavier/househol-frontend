export type ProjectResponse = {
  id: string;
  name: string;
  updatedAt: Date;
  createdBy: string;
};

export type RawProjectResponse = {
  projects: {
    id: string;
    name: string;
    updatedAt: string;
    createdBy: string;
  };
};
