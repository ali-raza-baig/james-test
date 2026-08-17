import { apiClient, ApiEnvelope } from "@/lib/apiClient";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  bio?: string;
  profileImage?: string;
  locations: number,
  yearsOfExperinces: number,
  totalSoldProperties: number
}

export interface AdminProfileResponse {
  success: boolean;
  data: AdminProfile;
  message?: string;
}

// Fetch current admin profile
export const fetchAdminProfile = async (token: string): Promise<AdminProfileResponse> => {
  const response = await apiClient<AdminProfileResponse>("/admin/auth/me", {
    token,
  });
  return response;
};

// Update admin profile
export const updateAdminProfile = async (
  token: string,
  data: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    profileImage?: File | null;
    yearsOfExperinces: number,
    totalSoldProperties: number,
    locations: number
  }
): Promise<AdminProfileResponse> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);

  if (data.phone) {
    formData.append("phone", data.phone);
  }
  if (data.location) {
    formData.append("location", data.location);
  }
  if (data.bio) {
    formData.append("bio", data.bio);
  }
  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }
  if (data.locations) {
    formData.append('locations', String(data.locations))
  }
  if (data.totalSoldProperties) {
    formData.append('totalSoldProperties', String(data.totalSoldProperties))
  }
  if (data.yearsOfExperinces) {
    formData.append('yearsOfExperinces', String(data.yearsOfExperinces))
  }

  const response = await apiClient<AdminProfileResponse>("/admin/auth/profile", {
    token,
    method: "PUT",
    body: formData,
  });
  return response;
};

