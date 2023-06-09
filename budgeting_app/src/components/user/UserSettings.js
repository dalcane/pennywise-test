import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useState} from "react";
import {IconButton, InputAdornment, MenuItem} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Axios from "axios";
import ValidateEmail from "../../utils/email";

const UserSettings = ({setEffectOpen, setMessage}) => {
    const [open, setOpen] = React.useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [currentEmail, setCurrentEmail] = useState('');


        const [newEmail, setNewEmail] = useState("");
        const [emailError, setEmailError] = useState(false);

        const validateEmail = (email) => {
            // regular expression for email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                // invalid email format
                return false;
            }

            // split the email address into parts
            const parts = email.split("@");
            const domainParts = parts[1].split(".");
            const tld = domainParts[domainParts.length - 1].toLowerCase();

            // list of valid top-level domains
            const validTLDs = ["com", "org", "net", "edu", "gov", "fi"];

            // check if the top-level domain is valid
            return validTLDs.includes(tld);
        };

        const handleEmailChange = (event) => {
            const value = event.target.value;
            setNewEmail(value);
            setEmailError(!validateEmail(value));
        };


    const handleClick = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    const handleClickOpen = () => {
        handleGetEmail()
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOldPassword('')
        setPassword('');
        setRePassword('');
        setShowPassword(false)
    };


    const handleChangePassword = () => {
        const baseUrl = "http://localhost:3001/user/change-password";
        const userID = localStorage.getItem('UserID')
        if (password === rePassword && password !== oldPassword && 8 <= password.length) {
                Axios.post(baseUrl, {
                    oldPassword: oldPassword,
                    newPassword: password,
                    userID: userID
                }).then(() => {
                    setOpen(false)
                    setPassword('')
                    setRePassword('')
                    setOldPassword('')
                    setShowPassword(false)
                    setMessage('Password change was successful')
                    setEffectOpen(true)
                }).catch(response => {
                    alert(response.response.data)
                })
            } else {
                alert("Input of data doesn't meet requirements.")
            }
        }

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            // user clicked "OK"
            console.log('ok')
            // perform delete action here
        } else {
            // user clicked "Cancel"
            console.log('cancel')
            // do nothing or perform another action here
        }
    }
    const handleChangeEmail = () => {
        const baseUrl = "http://localhost:3001/user/change-email";
        const userID = localStorage.getItem('UserID')
        if(ValidateEmail(newEmail)) {
            Axios.post(baseUrl, {
                newEmail: newEmail,
                userID: userID
            }).then(() => {
                setOpen(false)
                setNewEmail('')
                setShowPassword(false)
                setMessage('Email change was successful')
                setEffectOpen(true)
            }).catch(response => {
                alert(response.response.data)
            })
        } else {
            alert('Email-address does not meet requirements.')
        }
    }
    const handleGetEmail = () => {
        const userID = localStorage.getItem('UserID')
        const baseUrl = `http://localhost:3001/user/${userID}/get-email`
        Axios.get(baseUrl).then(((response) => {
            setCurrentEmail(response.data)
        })).catch((response) => {
            alert(response.response.data);
        });
    }

    return (
        <div className='secondary-button'>
            <MenuItem onClick={handleClickOpen}>Profile</MenuItem>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>User Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Here you can change your password
                    </DialogContentText>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="old-password"
                        label="Old Password"
                        type={showPassword ? 'text' : 'password'}
                        inputProps={{maxLength: 30}}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                        }}
                        variant="filled"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClick} onMouseDown={handleMouseDown}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={(event) => {
                            setOldPassword(event.target.value)
                        }}
                    />
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="password-first"
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        inputProps={{maxLength: 30}}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                        }}
                        variant="filled"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClick} onMouseDown={handleMouseDown}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={(event) => {
                            setPassword(event.target.value)
                        }}
                    />
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="password-again"
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        inputProps={{maxLength: 30 }}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                        }}

                        variant="filled"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClick} onMouseDown={handleMouseDown}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={(event) => {
                            setRePassword(event.target.value)
                        }}
                    />
                    <Button onClick={handleChangePassword} style={{float: "right"}}>Update Password</Button>
                    <hr style={{width: "100%", height: "2px"}}></hr>
                    <DialogContentText>
                        Here you can change your email
                    </DialogContentText>
                    <TextField
                        autoFocus
                        disabled
                        margin="dense"
                        id="current-email"
                        label={currentEmail}
                        inputProps={{ maxLength: 60 }}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                        }}
                        variant="filled"
                        fullWidth
                    />
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="first-email"
                        label="New email"
                        inputProps={{ maxLength: 60 }}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                        }}
                        variant="filled"
                        fullWidth
                        value={newEmail}
                        onChange={handleEmailChange}
                        error={emailError}
                        helperText={
                            emailError
                                ? "Please enter a valid email address with a valid top-level domain (e.g. .com, .org, .net)"
                                : ""
                        }
                    />
                </DialogContent>
                <DialogActions style={{justifyContent: "space-between"}}>
                    <Button onClick={handleDelete} style={{ color: "red", backgroundColor: "#ffebee" }}>Delete User</Button>
                    <div>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleChangeEmail}>Update Email</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserSettings