import { ApiResponse, User, UserDetails } from ".";

// Auth Types
export interface Auth {
	user: User;
	token: string;
}
export type AuthResponse = ApiResponse<Auth>;
