import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
  TextField,
} from "@mui/material";
import {
  getIAMUsers,
  toggleStatus,
  createIAMUser,
  deleteIAMUser,
} from "../redux/iamSlice";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const IAMUsersComponent = () => {
  const dispatch = useDispatch();
  const { iamUsers, isLoading, isError, message } = useSelector(
    (state) => state.shared
  );
  const { user } = useSelector((state) => state.auth);

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ iamUsername: "", roles: [] });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (user) {
      dispatch(getIAMUsers());
    }
  }, [user, dispatch]);

  const handleStatusToggle = async (iamUserId, status) => {
    await dispatch(toggleStatus({ iamUserId, data: { status } }));
  };

  const handleDeleteUser = async (iamUserId) => {
    await dispatch(deleteIAMUser(iamUserId));
  };

  const handleCreateUser = async () => {
    await dispatch(createIAMUser(newUser));
    setNewUser({ iamUsername: "", roles: [] });
  };

  const handleModalOpen = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setOpenModal(false);
  };

  return (
    <div className="p-6">
      <Box
        className="mb-4"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <h2 className="text-2xl font-semibold">IAM Users</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Create User
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <div className="text-red-600">{message}</div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {iamUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.iamUsername}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={user.isActive ? "success" : "error"}
                      onClick={() =>
                        handleStatusToggle(user._id, !user.isActive)
                      }
                    >
                      {user.isActive ? <CheckIcon /> : <CloseIcon />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleModalOpen(user)}
                      className="mr-2"
                    >
                      View Roles
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
          sx={{ maxWidth: isMobile ? "90%" : "50%" }}
        >
          {selectedUser ? (
            <>
              <h3 className="text-xl font-semibold mb-4">
                Roles & Permissions for {selectedUser?.iamUsername}
              </h3>
              <div>
                <h4 className="font-medium">Roles:</h4>
                <ul>
                  {selectedUser?.roles?.map((role, index) => (
                    <li key={index} className="text-sm">
                      {role.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleModalClose}
                  variant="contained"
                  color="secondary"
                >
                  Close
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4">
                Create New IAM User
              </h3>
              <TextField
                label="Username"
                value={newUser.iamUsername}
                onChange={(e) =>
                  setNewUser({ ...newUser, iamUsername: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Roles (comma separated)"
                value={newUser.roles.join(", ")}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    roles: e.target.value.split(",").map((role) => role.trim()),
                  })
                }
                fullWidth
                margin="normal"
              />
              <div className="mt-4">
                <Button
                  onClick={handleCreateUser}
                  variant="contained"
                  color="primary"
                >
                  Create
                </Button>
                <Button
                  onClick={handleModalClose}
                  variant="contained"
                  color="secondary"
                  className="ml-2"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default IAMUsersComponent;
