import React, {useEffect, useState} from 'react';
import MuiTransactionGrid from "../components/account/mui-TransactionGrid";
import {getUserTransactions} from "../components/account/mui-TransactionGrid"

const Accounts = ({loggedIn, addTransactionSuccess, setaddTransactionSuccess, setEffectOpen, setMessage}) => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (loggedIn || addTransactionSuccess) {
            const userID = localStorage.getItem('UserID');
            getUserTransactions(userID).then((data) => setRows(data)).catch((error) => {
                console.log(error)
                alert('error retrieving UserTransactions')
            });
            setaddTransactionSuccess(false)
        }
    }, [loggedIn, addTransactionSuccess]);

  return (
      <div className="transaction">
          <MuiTransactionGrid rows={rows} setRows={setRows} setaddTransactionSuccess={setaddTransactionSuccess} setEffectOpen={setEffectOpen} setMessage={setMessage}/>
      </div>
  );
};

export default Accounts;