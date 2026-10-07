
import axiosInstance from "../redux/axiosInstance";



export const getAbstractsApi = (params = {}) => {
  return axiosInstance.get("/user/abstracts", {
    params,
  });
};


export const getAbstractByIdApi = (id) => {
  return axiosInstance.get(
    `/user/abstracts/${id}`
  );
};



export const deleteAbstractApi = (id) => {
  return axiosInstance.delete(
    `/user/abstracts/${id}`
  );
};

export default axiosInstance;
