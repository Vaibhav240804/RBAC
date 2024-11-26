import React, { useState } from "react";
import * as Components from "../components/login";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-hot-toast";
import VerifyOtp from "../components/VerifyOtp";
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";
import API from "../API";

export default function SigninSignup() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    accountId: "",
    iamUsername: "",
    isRoot: true,
  });
  const [signupInfo, setSignupInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [signIn, toggle] = useState(true);

  const [isRoot, setIsRoot] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleClickShowLoginPassword = () =>
    setShowLoginPassword((show) => !show);

  const [showOtp, setShowOtp] = useState(false);
  const [btnName, setBtnName] = useState("Log In");

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(signupInfo);
    if (!signupInfo.username || !signupInfo.email || !signupInfo.password) {
      toast.error("Please fill all the fields");
      toggle(false);
      return;
    }
    if (signupInfo.password !== confirmPassword) {
      toast.error("Passwords do not match");
      toggle(false);
      return;
    }
    try {
      const res = await API.signup(signupInfo);
      toast.success(res.message);
      toggle(true);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(errorMessage, 2);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(loginInfo);
    console.log(isRoot);
    setBtnName("Logging In...");

    if (isRoot) {
      if (!loginInfo.email || !loginInfo.password) {
        toast.error("Please fill all the fields");
        setBtnName("Log In");
        return;
      }
    } else {
      if (
        !loginInfo.accountId ||
        !loginInfo.iamUsername ||
        !loginInfo.password
      ) {
        toast.error("Please fill all the fields");
        setBtnName("Log In");
        return;
      }
    }
    try {
      const res = await API.login(loginInfo);
      toast.success(res.message);
      if (isRoot) {
        setShowOtp(true);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(errorMessage, 2);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <VerifyOtp
        open={showOtp}
        handleClose={() => setShowOtp(false)}
        email={loginInfo.email}
        setLoginInfo={setLoginInfo}
      />
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Create Root Account</Components.Title>
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              margin="normal"
              fullWidth
              size="small"
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, username: e.target.value })
              }
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              margin="normal"
              size="small"
              fullWidth
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, email: e.target.value })
              }
            />
            <div className="relative w-full">
              <TextField
                className="w-full "
                label="Password"
                variant="outlined"
                margin="normal"
                size="small"
                type={showPassword ? "text" : "password"}
                value={signupInfo.password}
                onChange={(e) =>
                  setSignupInfo({ ...signupInfo, password: e.target.value })
                }
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "18px",
                  right: "5px",
                }}
                onClick={handleClickShowPassword}
              >
                {showPassword ? (
                  <VisibilityOff sx={{ fontSize: "20px" }} />
                ) : (
                  <Visibility sx={{ fontSize: "20px" }} />
                )}
              </IconButton>
            </div>
            <div className="relative w-full">
              <TextField
                className="w-full "
                label="Confirm Password"
                variant="outlined"
                margin="normal"
                size="small"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "18px",
                  right: "5px",
                }}
                onClick={handleClickShowConfirmPassword}
              >
                {showConfirmPassword ? (
                  <VisibilityOff sx={{ fontSize: "20px" }} />
                ) : (
                  <Visibility sx={{ fontSize: "20px" }} />
                )}
              </IconButton>
            </div>
            <Components.Button
              onClick={handleSignup}
              style={{
                marginTop: "1rem",
              }}
            >
              Sign Up
            </Components.Button>
          </Components.Form>
        </Components.SignUpContainer>
        <Components.SignInContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title
              style={{
                fontSize: "1.5rem",
              }}
            >
              Sign in
            </Components.Title>
            <TextField
              id="outlined-basic"
              className="w-full "
              label={isRoot ? "Email" : "Account ID"}
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={(e) =>
                !isRoot
                  ? setLoginInfo({ ...loginInfo, accountId: e.target.value })
                  : setLoginInfo({ ...loginInfo, email: e.target.value })
              }
            />
            {!isRoot && (
              <TextField
                className="w-full "
                id="outlined-basic"
                label="Username"
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, iamUsername: e.target.value })
                }
              />
            )}
            <div className="relative w-full">
              <TextField
                className="w-full "
                label="Password"
                variant="outlined"
                margin="normal"
                type={showLoginPassword ? "text" : "password"}
                value={loginInfo.password}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "22px",
                  right: "8px",
                }}
                onClick={handleClickShowLoginPassword}
              >
                {showLoginPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!isRoot}
                  onChange={() => {
                    setIsRoot((prev) => !prev);
                    setLoginInfo({ ...loginInfo, isRoot: isRoot });
                  }}
                  color="purple"
                />
              }
              label="IAM User"
            />
            <Components.Button
              onClick={handleLogin}
              style={{
                marginTop: "1rem",
              }}
            >
              {btnName}
            </Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                Create Once, Share Everywhere - Amplify Your Digital Presence.
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome to RailCart!</Components.Title>
              <Components.Paragraph>
                One Click, Infinite Connections - Your Content, Everywhere!
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  );
}
