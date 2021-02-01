export interface UserResponse {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  id: string;
  uid: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
  expires: string;
}

export interface WhoAmIResponse {
  user: UserResponse;
  csrfToken: string | null;
  edition: {
    id?: string;
    name: string;
    title?: string;
  };
  features: {
    rejectJobs: boolean;
  };
  organization: {
    id: string;
    name: string;
  };
}

export type ProjectStatusResponse =
  | "NEW"
  | "ACCEPTED"
  | "ASSIGNED"
  | "DECLINED"
  | "REJECTED"
  | "DELIVERED"
  | "EMAILED"
  | "COMPLETED"
  | "CANCELLED";

export interface ProjectsResponse {
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  numberOfElements: number;
  content: ProjectResponse[];
}

export interface ProjectResponse {
  uid: string;
  internalId: number;
  id: string;
  name: string;
  dateCreated: string;
  status: ProjectStatusResponse;
  dateDue: string;
  sourceLang: string;
  targetLangs: string[];
}
