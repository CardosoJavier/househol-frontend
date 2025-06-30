export type ProjectResponse = {
  id: string;
  name: string;
  updatedAt: Date;
};

export type RawProjectResponse = {
  projects: {
    id: string;
    name: string;
    updatedAt: string;
  };
};
