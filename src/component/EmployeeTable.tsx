import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Button,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { addEmployees, deleteEmployee, fetchEmployees, updateEmployeeRecord } from "../api/employeeApi";
import EmployeeForm from "./EmployeeForm";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
};

const EmployeeTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openForm, setOpenForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [pageRefresh, setPageRefresh] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employee", error);
      }
    };
    loadEmployees();
  }, [pageRefresh]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: number) => {
    setOpenForm(true)
  };

  const handleDelete = async (id: number) => {
    const res = await deleteEmployee(id)
    setPageRefresh(true)
  };

  const handleAddEmployee = () => {
    setOpenForm(true);
  };

  const handleSave = async (employee: { firstName: string; lastName: string; email: string; department: string }) => {
    if (editingEmployee) {
      await updateEmployeeRecord(employee);
    } else {
      await addEmployees(employee);
    }
    setPageRefresh(true);
    setOpenForm(false); // Close the form dialog after save
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Employee List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddEmployee}
        sx={{ mb: 2 }}
      >
        Add Employee
      </Button>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{emp.id}</TableCell>
                    <TableCell>{emp.firstName}</TableCell>
                    <TableCell>{emp.lastName}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(emp.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(emp.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={employees.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
        <EmployeeForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSave={(employee) => {
            handleSave(employee);
          }}
        />
      </Paper>
    </Box>
  );
};

export default EmployeeTable;
