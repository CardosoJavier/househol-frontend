import { FamilyProps } from "./FamilyProps";

export type UserAccountProps = {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    family: FamilyProps;
}