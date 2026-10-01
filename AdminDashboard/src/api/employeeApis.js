import axiosInstance from "../redux/axiosInstance";



export const createEmployeeApi = (employeeData) => {
  return axiosInstance.post(
    "/admin/employees",
    employeeData
  );
};


export const getEmployeesApi = () => {
  return axiosInstance.get("/admin/employees");
};



export const getEmployeeByIdApi = (id) => {
  return axiosInstance.get(
    `/admin/employee/${id}`
  );
};



export const updateEmployeeApi = ({
  id,
  employeeData,
}) => {
  return axiosInstance.put(
    `/admin/employee/${id}`,
    employeeData
  );
};



export const deleteEmployeeApi = (id) => {
  return axiosInstance.delete(
    `/admin/employee/${id}`
  );
};