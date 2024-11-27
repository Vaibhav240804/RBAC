import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  AddCircleOutline as AddIcon,
  AssignmentInd as AssignRoleIcon,
} from "@mui/icons-material";
import { deleteRolebyId, createRole, assignRoles } from "../redux/roleSlice";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import toast from "react-hot-toast";

function RolesComponent() {
  const dispatch = useDispatch();
  const { roles, createdRoles, iamUsers } = useSelector(
    (state) => state.shared
  );
  const { allPermissions } = useSelector((state) => state.perm);
  const { isRoot } = useSelector((state) => state.auth);
  const { isSuccess, message } = useSelector((state) => state.role);

  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [roleToAssign, setRoleToAssign] = useState("");
  const [userToAssign, setUserToAssign] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success(message);
    }
  }, [isSuccess, message]);


  const handleCreateRole = async () => {
    if (newRoleName) {
      dispatch(
        createRole({ name: newRoleName, permissionIds: selectedPermissions })
      );
      setNewRoleName("");
      setSelectedPermissions([]);
    }
  };

  const handleDeleteRole = async () => {
    if (roleToDelete) {
      dispatch(deleteRolebyId(roleToDelete));
      setOpenDeleteDialog(false);
      setRoleToDelete(null);
    }
  };

  const handleAssignRoleToUser = async () => {
    if (roleToAssign && userToAssign) {
      dispatch(assignRoles({ roleToAssign, userToAssign }));
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Paper
          elevation={3}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl space-y-4 lg:col-span-1"
        >
          <Typography
            variant="h5"
            className="text-blue-800 font-bold mb-4 border-b-2 border-blue-300 pb-2"
          >
            Assigned Roles
          </Typography>

          <div className="space-y-4">
            {isRoot && (
              <div>
                <Typography variant="h6" className="text-blue-700 mb-4">
                  Assigned Roles
                </Typography>
                <TableContainer className="mt-4" component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Role Name</TableCell>
                        <TableCell align="right">Permissions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roles.length > 0 &&
                        roles.map((role) => (
                          <TableRow key={role._id}>
                            <TableCell component="th" scope="row">
                              {role.name}
                            </TableCell>
                            <TableCell align="right">
                              {role.permissions.length}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
        </Paper>

        <Paper
          elevation={3}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl space-y-4 lg:col-span-1"
        >
          <Typography
            variant="h5"
            className="text-blue-800 font-bold mb-4 border-b-2 border-blue-300 pb-2"
          >
            Role Management
          </Typography>

          <div className="space-y-4">
            {isRoot && (
              <div>
                <Typography variant="h6" className="text-blue-700 mb-2">
                  Created Roles
                </Typography>
                <TableContainer className="mt-4" component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Role Name</TableCell>
                        <TableCell align="right">Permissions</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {createdRoles.length > 0 &&
                        createdRoles.map((role) => (
                          <TableRow key={role._id}>
                            <TableCell component="th" scope="row">
                              {role.name}
                            </TableCell>
                            <TableCell align="right">
                              {role.permissions.length}
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => {
                                  setRoleToDelete(role._id);
                                  setOpenDeleteDialog(true);
                                }}
                                className="hover:bg-red-50"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
        </Paper>

        {isRoot && (
          <Paper
            elevation={3}
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl space-y-4 lg:col-span-1"
          >
            <Typography
              variant="h5"
              className="text-green-800 font-bold mb-4 border-b-2 border-green-300 pb-2"
            >
              Create New Role
            </Typography>

            <TextField
              label="Role Name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              fullWidth
              variant="outlined"
              className="mb-4"
            />

            <Typography variant="h6" className="text-green-700 mb-2">
              Assign Permissions
            </Typography>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 bg-white rounded-md shadow-inner">
              {allPermissions.map((permission) => (
                <FormControlLabel
                  key={permission._id}
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(permission._id)}
                      onChange={() => handlePermissionToggle(permission._id)}
                      color="primary"
                    />
                  }
                  label={
                    <span className="text-sm text-gray-700">
                      {permission.name}
                    </span>
                  }
                />
              ))}
            </div>

            <Button
              onClick={handleCreateRole}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              className="mt-4 hover:bg-green-600"
            >
              Create Role
            </Button>
          </Paper>
        )}

        {isRoot && (
          <Paper
            elevation={3}
            className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl space-y-4 lg:col-span-1"
          >
            <Typography
              variant="h5"
              className="text-purple-800 font-bold mb-4 border-b-2 border-purple-300 pb-2"
            >
              Assign Role to User
            </Typography>

            <div className="space-y-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="role-to-assign-label">Select Role</InputLabel>
                <Select
                  labelId="role-to-assign-label"
                  value={roleToAssign}
                  onChange={(e) => setRoleToAssign(e.target.value)}
                  label="Select Role"
                >
                  {createdRoles.length > 0 &&
                    createdRoles.map((role) => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="user-to-assign-label">Select User</InputLabel>
                <Select
                  labelId="user-to-assign-label"
                  value={userToAssign}
                  onChange={(e) => setUserToAssign(e.target.value)}
                  label="Select User"
                >
                  {iamUsers.length > 0 &&
                    iamUsers.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.username}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Button
                onClick={handleAssignRoleToUser}
                variant="contained"
                color="primary"
                startIcon={<AssignRoleIcon />}
                fullWidth
                className="mt-4 hover:bg-purple-600"
              >
                Assign Role
              </Button>
            </div>
          </Paper>
        )}
      </div>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="text-red-700">
          Confirm Role Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="text-gray-700">
            Are you absolutely sure you want to delete this role? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteRole}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            autoFocus
          >
            Delete Role
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default RolesComponent;
