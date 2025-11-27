interface UserRole {
    name: string;
}

export interface CreatePersonnel {
    name: string;
    email: string;
    role_id?: number;
}
export interface User extends CreatePersonnel {
    id?: number;
    password: string;
    status?: number;
    role?: UserRole;
}

