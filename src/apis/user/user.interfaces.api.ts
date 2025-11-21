interface UserRole {
    name: string;
}

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}