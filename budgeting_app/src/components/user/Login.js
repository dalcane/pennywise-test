import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Register from './Register';
import Axios from "axios";
import {IconButton, InputAdornment, Select} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import {useEffect} from "react";
import UserSettings from "./UserSettings";
import styled from '@emotion/styled';

const Login = ({loggedIn, setLoggedIn, setIsSidebarOpen, setEffectOpen, setMessage}) => {
    const [open, setOpen] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [show, setShow] = React.useState('Login');
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClick = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setUsername('');
        setPassword('');

    };

    useEffect(() => {
        if (loggedIn){
            setShow(localStorage.getItem('Username'))
        }else{
            setShow('Login')
        }
    }, [loggedIn])

    /*
    * Tallentaa cacheen Username, UserID
    */
    const handleCloseAndLogin = () => {
        const baseUrl = "http://localhost:3001/user/login"
        Axios.post(baseUrl, {
            username: username,
            password: password
        }).then(((response) =>{
            setShow(username) //Muutetaan Login buttonin tieto käyttäjännimeksi
            setUsername('');
            setPassword('');
            setLoggedIn(true)
            setOpen(false);
            localStorage.setItem("UserID", response.data.toString());
            localStorage.setItem("Username", username);
            setMessage(`Welcome ${username}`)
            setEffectOpen(true)
        })).catch((response) => {
            alert(response.response.data)
        })
    };
    const handleLogout = () => {
        setLoggedIn(false);
        localStorage.removeItem("UserID");
        localStorage.removeItem("Username");
        localStorage.removeItem("Month");
        localStorage.removeItem("Year")
        setShow('Login')
        setIsSidebarOpen(false)
    };

    const headerStyling ={
        "&.Mui-focused": {
            "& fieldset": {
                borderColor: '#d380ff',
                color: "#d380ff",
                outlineColor: "#d380ff",
                outlineWidth: "2px"
            },
            //color: "#d380ff !important",
            outlineColor: "#d380ff !important",
            outlineWidth: "2px"
        },
        "&.MuiOutlinedInput-root:hover": {
            "& fieldset": {
                borderColor: '#d380ff !important',
                color: "#d380ff",
                outlineColor: "#d380ff",
                outlineWidth: "2px"
            }
        },
        "&.MuiOutlinedInput-root:focused": {
            "& fieldset": {
                borderColor: '#d380ff !important',
                color: "#d380ff",
                outlineColor: "#d380ff",
                outlineWidth: "2px"
            }
        },
        "&.MuiOutlinedInput-root": {
            color: "#ffffff",
        "& fieldset": {
            borderColor: '#ffffff !important',
                color: "#d380ff",
            }
        },
        "&.MuiButtonBase-root": {
            color: "#ffffff",
            borderColor: '#ffffff !important',
            borderRadius: '4px !important',
            "& fieldset": {
                borderColor: '#ffffff !important',
                color: "#d380ff",
            }
        },
        "&.MuiButtonBase-root:hover": {
            borderColor: '#d380ff !important',
            color: "#d380ff",
            borderRadius: '4px !important',
            "& fieldset": {
                borderColor: '#ffffff !important',
                color: "#d380ff",
            }
        },

        "&.MuiOutlinedInput-root:active": {
            color: "#ffffff !important",
            "& fieldset": {
                borderColor: '#ffffff !important',
                color: "#d380ff",
            }
        }

    };

    return (
        <div className='primary-button' >
            <span>
            {loggedIn ?
                <Select
                    sx={headerStyling}
                    className='login-select' variant="outlined" value={show} onChange={(event) => setShow(event.target.value)}
                        inputProps={{IconComponent: () => null }} >
                    <MenuItem value={show} style={{display: 'none'}}>{show}</MenuItem>
                    <UserSettings setMessage={setMessage} setEffectOpen={setEffectOpen}></UserSettings>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Select>
                :
                <Button sx={headerStyling} className='login-select' variant="outlined" onClick={handleClickOpen}>
                    {show}
                </Button>
            }
            </span>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To login please enter your username and password. If you don't have account, press sign up.
                    </DialogContentText>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Username"
                        inputProps={{maxLength: 30}}
                        fullWidth
                        variant="filled"
                        onChange={(event) => {setUsername(event.target.value)}}

                    />
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="password-first"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        inputProps={{maxLength: 30}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClick} onMouseDown={handleMouseDown}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        variant="filled"
                        onChange={(event) => {setPassword(event.target.value)}}
                    />
                </DialogContent>
                <DialogActions>
                    <Register></Register>
                    <Button onClick={handleClose} className="cancel-button">Cancel</Button>
                    <Button onClick={handleCloseAndLogin} className="login-button">Log in</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Login;
