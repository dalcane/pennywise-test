import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Axios from "axios";
import {Select} from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import {Box} from "@mui/material";
import {useState} from "react";

const CreateBankAcc = ({setCreateAccSuccess, setMessage, setEffectOpen}) => {
  const [open, setOpen] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAccountType("");
    setAccountName("");
    setAccountBalance("");
  };

  const handleCreateAcc = () => {
    const baseUrl = "http://localhost:3001/account/new-account";
    //Pitää tarkastaa aikavyöhyke oikein
    const today = new Date().toISOString().slice(0, 10);
    const userID = localStorage.getItem("UserID");

    Axios.post(baseUrl, {
      AccountName: accountName,
      AccountType: accountType,
      Balance: accountBalance,
      BalanceDate: today,
      UserID: userID,
    }).then(() => {
      setOpen(false);
      setAccountType("");
      setAccountName("");
      setAccountBalance("");
      setCreateAccSuccess(true)
      setMessage(`Account ${accountName} was created`)
      setEffectOpen(true)
    }).catch(response => {
      alert(response.response.data)
    });

  };

  return (
    <div className="bank-button">
      <Button id="bank-button-1" onClick={handleClickOpen}>
        <Box mr={1}>
          <AddCircleOutline />
        </Box>
        <Box mr={1}>
        Add 
        </Box>
        <Box mr={1}>
        Account 
        </Box>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Bank Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a bank account you must add your account name, select the
            type of account you want to open and type in your balance for the
            account.
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="account-name"
            label="Account Name"
            fullWidth
            inputProps={{maxLength: 30}}
            value={accountName}
            variant="filled"
            onChange={(event) => {
              setAccountName(event.target.value);
            }}
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="account-balance"
            label="Account Balance"
            type="number"
            fullWidth
            inputProps={{maxLength: 11}}
            value={accountBalance}
            variant="filled"
            onChange={(event) => {
              setAccountBalance(event.target.value);
            }}
          />
          <FormControl required margin="dense">
            <InputLabel id="account-type-label">Account Type</InputLabel>
            <Select
              style={{ height: "50px", width: "200px" }}
              labelId="account-type-label"
              id="account-type"
              fullWidth
              value={accountType}
              onChange={(event) => {
                setAccountType(event.target.value);
              }}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Checking">Checking</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Savings">Savings</MenuItem>
              <MenuItem value="Loan">Loan</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="cancel-button">
            Cancel
          </Button>
          <Button onClick={handleCreateAcc} className="Save-button">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateBankAcc