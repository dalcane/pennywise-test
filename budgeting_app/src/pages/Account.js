import React, {useEffect, useState} from 'react';
import {AccountTransactionGrid, getAccountTransactions} from "../components/account/AccountTransactionGrid";
import {useParams} from "react-router-dom";


const Account = ({loggedIn, setMessage, setEffectOpen, setAddAccTransactionSuccess, addAccTransactionSuccess}) => {
    const { AccountName } = useParams();
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (loggedIn || addAccTransactionSuccess) {
            const userID = localStorage.getItem('UserID');
            getAccountTransactions(userID, AccountName).then((data) => setRows(data)).catch((error) => {
                console.log(error)
                alert('error retrieving UserAccountTransactions')
            });
            setAddAccTransactionSuccess(false)
        }
    }, [loggedIn, addAccTransactionSuccess, AccountName]);

    return (
        <div className="transaction">
            <AccountTransactionGrid rows={rows} AccountName={AccountName} setMessage={setMessage} setRows={setRows} setEffectOpen={setEffectOpen} setAddAccTransactionSuccess={setAddAccTransactionSuccess}/>
        </div>
    );
};

export default Account;