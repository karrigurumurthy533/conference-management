const API_URL = "http://localhost:5000/api/v1/admin/";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const createConferenceApi = async (formData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleResponse(response);
};

export const getConferencesApi = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};

export const getConferenceByIdApi = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse(response);
};

export const updateConferenceApi = async ({ id, formData }) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  return handleResponse(response);
};

export const deleteConferenceApi = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(response);
};

export const publishConferenceApi = async (id) => {
  const response = await fetch(`${API_URL}/${id}/publish`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleResponse(response);
};