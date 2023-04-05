import React, {useEffect, useState} from "react";
import {Alert, Collapse, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CustomAlert = ({ message, effectOpen, setMessage, setEffectOpen}) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(effectOpen) {
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
                setMessage('')
                setEffectOpen(false)
            }, 5000);
        }
    }, [effectOpen]);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Collapse in={open}>
            <Alert
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            handleClose()
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{ mb: 2 }}
            >
                {message}
            </Alert>
        </Collapse>
    );
};

export default CustomAlert;

