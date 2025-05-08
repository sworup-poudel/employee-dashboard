import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';

export const fetchEmployees = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addEmployees = async (employee: { firstName: string; lastName: string; email: string; department: string; }) => {
    console.log("we are here")
    const response = await axios.post(API_URL, employee);
    return response.data;
};

export const deleteEmployee = async (empId: number) => {
    const response = await axios.delete(`${API_URL}/${empId}`);
    return response.data;
};

