export type UserRole = "HUNTER" | "ORGANIZER" | "ADMIN" | "REVIEWER";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Hunt {
  id: number;
  title: string;
  description: string;
  organizerId: number;
  startDate: string;
  endDate: string;
  huntStatus: string;
  location: Location;
}

export interface PageResponse {
  content: Hunt[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      direction: string;
      property: string;
      ignoreCase: boolean;
      nullHandling: string;
      ascending: boolean;
      descending: boolean;
    }[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    direction: string;
    property: string;
    ignoreCase: boolean;
    nullHandling: string;
    ascending: boolean;
    descending: boolean;
  }[];
  numberOfElements: number;
  empty: boolean;
}
