import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Select, Switch, FormControlLabel, } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as React from "react";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

const AddAccTransaction = ({setAddAccTransactionSuccess, setMessage, setEffectOpen, AccountName}) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(dayjs(Date.now()));
    const [transactionName, setTransactionName] = useState("");
    const [recipient, setRecipient] = useState("");
    const [inflow, setInflow] = useState(0.0);
    const [outflow, setOutflow] = useState(0.0);
    const [transactionRepeat, setTransactionRepeat] = useState("");
    const [memo, setMemo] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [payeeList, setPayeeList] = useState([]);
    const [showGoal, setShowGoal] = useState(false);

    const handleChange = (newValue) => {
        setDate(newValue);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSubCategory("");
    };

    const getPayeeList = () => {
        const userID = localStorage.getItem('UserID');
        const baseUrl = `http://localhost:3001/transaction/user-${userID}/get-payee-list`;
        const updatedArray = [];
        return Axios.get(baseUrl).then((response) => {
            for (let x = 0; x < response.data.length; x++) {
                const payee = response.data[x].Payee;
                updatedArray.push({value: payee});
          }
          setPayeeList([]);
          setPayeeList(updatedArray);
        }).catch((response) => {
            alert(response.response.data);
        });
    };

    const getUserSubcategories = () => {
        const userID = localStorage.getItem("UserID");
        const baseUrl = `http://localhost:3001/subcategory/${userID}/subcategory-name`;
        const updatedArray2 = [];
        Axios.get(baseUrl).then((response) => {
            for (let x = 0; x < response.data.length; x++) {
                const subCategoryName = response.data[x].SubCategoryName;
                updatedArray2.push({ value: subCategoryName });
            }
            setSubCategoryList([]);
            setSubCategoryList(updatedArray2);
        }).catch((response) => {
            alert(response.response.data);
        });
    };

    const addTransaction = () => {
        const userID = localStorage.getItem("UserID");
        const baseUrl = `http://localhost:3001/transaction/new-transaction`;

        Axios.post(baseUrl, {
            TransactionName: transactionName,
            Outflow: outflow || 0,
            Inflow: inflow || 0,
            Recipient: recipient,
            TransactionRepeat: transactionRepeat,
            Memo: memo,
            TransactionDate: date,
            AccountName: AccountName,
            SubCategoryName: subCategory,
            UserID: userID,
        }).then(() => {
            setOpen(false);
            setSubCategory("");
            setInflow(0.0);
            setOutflow(0.0);
            setAddAccTransactionSuccess(true)
            setMessage('Transaction was made')
            setEffectOpen(true)
        }).catch((response) => {
            console.log({
                TransactionName: transactionName,
                Outflow: outflow,
                Inflow: inflow,
                Recipient: recipient,
                TransactionRepeat: transactionRepeat,
                Memo: memo,
                TransactionDate: date,
                AccountName: AccountName,
                SubCategoryName: subCategory,
                UserID: userID,
            })
            alert(response.response.data);
        });
    };

    return (
        <div>
            <Button onClick={handleClickOpen} className="AddTransaction"> <AddCircleOutline sx={{fontSize: "18px", marginLeft: "-2px", marginRight: "8px"}}/> Add transaction </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogContent>
                    <DialogContentText>Fill all fields</DialogContentText>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date desktop"
                            inputFormat="YYYY-MM-DD"
                            value={date}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="transactionName"
                        label="Transaction Name"
                        fullWidth
                        variant="filled"
                        onChange={(event) => {
                            setTransactionName(event.target.value);
                        }}
                    />
                    <TextField
                        type="number"
                        autoFocus
                        margin="dense"
                        id="outflow"
                        label="Outflow"
                        fullWidth
                        variant="filled"
                        onChange={(event) => {
                            setOutflow(parseFloat(event.target.value));
                        }}
                    />
                    <TextField
                        type="number"
                        autoFocus
                        margin="dense"
                        id="inflow"
                        label="Inflow"
                        fullWidth
                        variant="filled"
                        onChange={(event) => {
                            setInflow(parseFloat(event.target.value));
                        }}
                    />
                    <div className="transaction-selects">
            <div className="transaction-payee">
              <InputLabel id="account">Payee *</InputLabel>
              <Select
                style={{ height: "50px", width: "550px" }}
                id="account-payee-list"
                labelId="Payee"
                fullWidth
                required
                onOpen={getPayeeList}
                value={recipient}
                onChange={(event) => {
                  setRecipient(event.target.value);
                }}
              >
                {payeeList.map((recipient) => (
                  <MenuItem key={recipient.value} value={recipient.value}>
                    {recipient.value}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <FormControlLabel control={<Switch default/>}
                              label="Add a payee?"
                            id="switch"
                              value="true"
                              onChange={() => setShowGoal(!showGoal)}/>

            {showGoal && (
                <div>


                  <DialogContentText>
                    Here you can type a payee.
                  </DialogContentText>
                  <TextField
            required
            autoFocus
            margin="dense"
            id="payee"
            label="Payee"
            fullWidth
            variant="filled"
            onChange={(event) => {
              setRecipient(event.target.value);
            }}
          />
                </div>)}
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="memo"
                        label="Memo"
                        fullWidth
                        variant="filled"
                        onChange={(event) => {
                            setMemo(event.target.value);
                        }}
                    />
                    <div className="transaction-account">
                        <InputLabel id="account">Account *</InputLabel>
                        <TextField
                            disabled
                            autoFocus
                            margin="dense"
                            id="Account"
                            label={AccountName}
                            fullWidth
                            variant="filled"
                        />
                    </div>
                    <div className="transaction-selects">
                        <div className="transaction-repeat">
                        <InputLabel>Transaction Repeat *</InputLabel>
                        <Select
                            style={{ height: "50px", width: "250px" }}
                            fullWidth
                            required
                            value={transactionRepeat}
                            onChange={(event) => {
                                setTransactionRepeat(event.target.value);
                            }}
                        >
                            <MenuItem value="Once">Once</MenuItem>
                            <MenuItem value="Daily">Daily</MenuItem>
                            <MenuItem value="Weekly">Weekly</MenuItem>
                            <MenuItem value="Monthly">Monthly</MenuItem>
                            <MenuItem value="Yearly">Yearly</MenuItem>
                        </Select>
                            </div>
                        <div className="transaction-category">
                            <InputLabel id="category">SubCategory *</InputLabel>
                            <Select
                                style={{ height: "50px", width: "250px" }}
                                id="subcategory-name"
                                labelId="category"
                                fullWidth
                                required
                                onOpen={getUserSubcategories}
                                value={subCategory}
                                onChange={(event) => {
                                    setSubCategory(event.target.value);
                                }}
                            >
                                {subCategoryList.map((subcategory) => (
                                    <MenuItem key={subcategory.value} value={subcategory.value}>
                                        {subcategory.value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} className="cancel-button">
                        Cancel
                    </Button>
                    <Button className="add-transaction" onClick={addTransaction}>
                        Add new Transaction
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddAccTransaction