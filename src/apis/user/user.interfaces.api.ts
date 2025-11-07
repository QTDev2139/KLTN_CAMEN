interface UserRole {
    name: string;
}

export interface User {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}