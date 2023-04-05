import React from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Axios from "axios";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavingsIcon from "@mui/icons-material/Savings";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

export const getUserAccounts = () => {
  const userID = localStorage.getItem("UserID");
  const baseUrl = `http://localhost:3001/account/${userID}`;
  const updatedArray = [];

  Axios.get(baseUrl)
    .then((res) => {
      for (let x = 0; x < res.data.length; x++) {
        const accountType = res.data[x].AccountType;
        let icon = null;
        switch (accountType) {
          case "Cash":
            icon = <AttachMoneyIcon />;
            break;
          case "Checking":
            icon = <AccountBalanceIcon />;
            break;
          case "Savings":
            icon = <SavingsIcon />;
            break;
          case "Credit Card":
            icon = <CreditCardIcon />;
            break;
          case "Loan":
            icon = <RequestQuoteIcon />;
            break;
          default:
            icon = null;
        }
        updatedArray.push({
          title: res.data[x].AccountName,
          path: `/accounts/${res.data[x].AccountName}`,
          icon: icon,
          balance: res.data[x].Balance, // new property to store balance
        });
      }
    })
    .catch((res) => {
      console.log(res)
      alert('catch SidebarData');
    });

  return updatedArray;
};

