import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MuiOtpInput } from "mui-one-time-password-input";
import API from "../API";

export default function VerifyOtp({ open, handleClose, email, setLoginInfo }) {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(pin);
    try {
      const res = await API.verifyOtp({ email, otp: pin });

      if (res.message === "OTP verified successfully") {
        toast.success("OTP verified successfully", 2);
        await timeout(1300);
        navigate("/login");
      } else {
        toast.error("Invalid OTP", 2);
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(errMsg, 2);
    } finally {
      setPin("");
      setLoginInfo({
        email: "",
        password: "",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          backdropFilter: "blur(15px)",
          backgroundColor: "rgba(148, 245, 221, 0.1)",
          borderRadius: "20px",
          color: "white",
        },
      }}
    >
      <DialogTitle>Verify your Email</DialogTitle>
      <DialogContent>
        <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Typography variant="body1">
              We have sent a code to your email:
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
              {email}
            </Typography>
            <MuiOtpInput
              value={pin}
              onChange={setPin}
              length={6}
              variant="outlined"
              TextFieldsProps={{ placeholder: "-" }}
              color={"white"}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "& .MuiOutlinedInput-input": {
                  color: "white",
                },
              }}
            />
            <Button
              fullWidth
              variant="outlined"
              // color="primary"

              onClick={handleSubmit}
              sx={{
                marginTop: 3,
                color: "white",
                borderColor: "white",
                ":hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              Verify
            </Button>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
}
