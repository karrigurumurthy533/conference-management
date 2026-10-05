import axiosInstance from "../redux/axiosInstance";

// Subscribe
export const subscribeApi = async (subscriberData) => {
  const response = await axiosInstance.post(
    "/user/subscribe",
    subscriberData
  );

  return response.data;
};


// Get All Subscribers
export const getSubscribersApi = async () => {
  const response = await axiosInstance.get(
    "/user/subscribers"
  );

  return response.data;
};


// Get Subscriber By ID
export const getSubscriberByIdApi = async (id) => {
  const response = await axiosInstance.get(
    `/user/subscribers/${id}`
  );

  return response.data;
};