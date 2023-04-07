import Axios from 'axios';
import {
    DataGrid, GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton, useGridApiContext
} from '@mui/x-data-grid';
import moment from "moment";
import AddTransaction from "../transaction/AddTransaction";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {Select} from "@mui/material";
import PropTypes from "prop-types";
import React, {useState} from "react";
import MenuItem from "@mui/material/MenuItem";

export const AccountsTransactionGrid = ({rows, setRows, setaddTransactionSuccess, setMessage, setEffectOpen, payeeList}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [pageSize, setPageSize] = useState(10)

    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                <AddTransaction setaddTransactionSuccess={setaddTransactionSuccess} setMessage={setMessage} setEffectOpen={setEffectOpen}/>
            </GridToolbarContainer>
        );
    }
    const SelectEditInputCell = (props) => {
        const { id, value, field } = props;
        const apiRef = useGridApiContext();
        const handleChange = async (event) => {
            await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
        };
        if(field === ('TransactionRepeat')){
            return (
                <Select
                    value={value}
                    onChange={handleChange}
                    size="small"
                    sx={{ height: 1 }}
                    native
                    autoFocus
                >
                    <option>Once</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                </Select>
            );
        }else if(field === ('Recipient')){
            return (
                <Select
                    size="small"
                    sx={{ height: 1 }}
                    autoFocus
                    onChange={handleChange}
                    value={value}
                >
                    {payeeList.map((payee) => (
                        <MenuItem key={payee.value} value={payee.value}>
                            {payee.value}
                        </MenuItem>
                    ))}
                </Select>
            )
        }
    }
    SelectEditInputCell.propTypes = {
        /**
         * The column field of the cell that triggered the event.
         */
        field: PropTypes.string.isRequired,
        /**
         * The grid row id.
         */
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        /**
         * The cell value.
         * If the column has `valueGetter`, use `params.row` to directly access the fields.
         */
        value: PropTypes.any,
    };

    const handleCellEditCommit = ({ id, field, value }) => {
        const updatedRows = rows.map((row) => {
            if (row.id === id) {
                return {
                    ...row,
                    [field]: value,
                };
            }
            return row;
        });
        setRows(updatedRows);
    };

    const renderSelectEditInputCell = (params) => {
        return <SelectEditInputCell {...params} />;
    };

    const handleSaveClick = (id) => () => {
        const selectedData = rows.filter(row => row.id === id);
        const baseUrl = 'http://localhost:3001/transaction/update-transaction'
        Axios.post(baseUrl, {
            TransactionName: selectedData[0].TransactionName,
            Recipient: selectedData[0].Recipient,
            TransactionRepeat: selectedData[0].TransactionRepeat,
            Memo: selectedData[0].Memo,
            TransactionID: selectedData[0].id
        }).then(() => {
            alert('edit success')
        }).catch(response => {
            alert(response.response.data)
        })
    };

    const handleDeleteClick = (id) => () => {
        const selectedData = rows.filter(row => row.id === id);
        const baseUrl = 'http://localhost:3001/transaction/delete-transaction'

        if (window.confirm('Are you sure?')) {
            Axios.post(baseUrl, {
                TransactionID: selectedData[0].id
            }).then(() => {
                alert('delete success success')
                setaddTransactionSuccess(true)
            }).catch(response => {
                alert(response.response.data)
            })
        }
    };

    const columns = [
        {field: 'TransactionDate', headerName: 'DATE', width: 150},
        {field: 'AccountName', headerName: 'AccountName', width: 150},
        {field: 'TransactionName', headerName: 'Transaction Name', width: 200, editable: true},
        {field: 'Subcategory', headerName: 'Subcategory', width: 200},
        {field: 'Outflow', headerName: 'Outflow', type: 'number', width: 100},
        {field: 'Inflow', headerName: 'Inflow', type: 'number', width: 100},
        {field: 'Recipient', headerName: 'Payee', width: 100, renderEditCell: renderSelectEditInputCell, editable: true},
        {field: 'TransactionRepeat', headerName: 'Repeat', width: 100, renderEditCell: renderSelectEditInputCell, editable: true},
        {field: 'Memo', headerName: 'Memo', width: 100, editable: true},
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={handleDeleteClick(id)}
                            color="inherit"
                        />,
                    ];
            },
        },
    ];

    return(
        <div style={{ width: '100%' }}>
            <DataGrid
                experimentalFeatures={{ columnGrouping: true }}
                autoHeight {...columns}
                columns={columns}
                rows={rows}
                onSelectionModelChange={(newSelection) => {
                    setSelectedRows(newSelection);
                }}
                selectionModel={selectedRows}
                onCellEditCommit={handleCellEditCommit}
                components={{
                    Toolbar: CustomToolbar,
                }}
                className="TransactionGrid"
                rowsPerPageOptions={[10,25,50]}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            />
    </div>
    )
}

export const getUserTransactions = (userID) => {
  const baseUrl = `http://localhost:3001/transaction/${userID}`;
  const updatedArray = [];
  return Axios.get(baseUrl).then(((response) => {
    for (let x = 0; x < response.data.length; x++) {
      let outflowCheck;
      let inflowCheck;

      if (response.data[x].Outflow === '0.00') {
        outflowCheck = null;
      } else outflowCheck = response.data[x].Outflow;

      if (response.data[x].Inflow === '0.00') {
        inflowCheck = null;
      } else inflowCheck = response.data[x].Inflow;

      updatedArray.push(
          {
            id: response.data[x].TransactionID,
            TransactionDate: moment(response.data[x].TransactionDate).format('YYYY-MM-DD'),
            AccountName: response.data[x].AccountName,
            TransactionName: response.data[x].TransactionName,
            Subcategory: response.data[x].SubcategoryName,
            Outflow: outflowCheck,
            Inflow: inflowCheck,
            Recipient: response.data[x].Recipient,
            TransactionRepeat: response.data[x].TransactionRepeat,
            Memo: response.data[x].Memo,
          },
      );
    }
    return updatedArray;
  })).catch((response) => {
    alert(response.response.data);
  });
};

