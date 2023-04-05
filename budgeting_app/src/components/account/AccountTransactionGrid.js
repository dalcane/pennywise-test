import Axios from 'axios';
import {
    DataGrid, GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton, useGridApiContext
} from '@mui/x-data-grid';
import moment from "moment";
import AddAccTransaction from "../transaction/AddAccTransaction";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {Select} from "@mui/material";
import PropTypes from "prop-types";
import {useState} from "react";

export const AccountTransactionGrid = ({AccountName, setEffectOpen, setMessage, setAddAccTransactionSuccess, rows, setRows}) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [pageSize, setPageSize] = useState(10)
    const CustomToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                <AddAccTransaction setEffectOpen={setEffectOpen} setMessage={setMessage} AccountName={AccountName} setAddAccTransactionSuccess={setAddAccTransactionSuccess}/>
            </GridToolbarContainer>
        );
    }

    function SelectEditInputCell(props) {
        const { id, value, field } = props;
        const apiRef = useGridApiContext();

        const handleChange = async (event) => {
            await apiRef.current.setEditCellValue({ id, field, value: event.target.value });
        };

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

    const handleGetSelectedData = (id) => {
        const selectedData = rows.filter(row => row.id === id);
        console.log(selectedData);
    };

    const renderSelectEditInputCell = (params) => {
        return <SelectEditInputCell {...params} />;
    };

    const handleSaveClick = (id) => () => {
        console.log(id)
        handleGetSelectedData(id)
    };

    const handleDeleteClick = (id) => () => {
        console.log(id)
    };

    const columns = [
        {field: 'TransactionDate', headerName: 'DATE', width: 150, editable: true},
        {field: 'TransactionName', headerName: 'Transaction Name', width: 200, editable: true},
        {field: 'Subcategory', headerName: 'Subcategory', width: 200},
        {field: 'Outflow', headerName: 'Outflow', type: 'number', width: 100, editable: true},
        {field: 'Inflow', headerName: 'Inflow', type: 'number', width: 100, editable: true},
        {field: 'Recipient', headerName: 'Payee', width: 100, editable: true},
        {field: 'TransactionRepeat', headerName: 'Repeat', renderEditCell: renderSelectEditInputCell, width: 100, editable: true},
        {field: 'Memo', headerName: 'Memo', width: 200, editable: true},
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

export const getAccountTransactions = (userID, accountName) => {
    const baseUrl = `http://localhost:3001/transaction/user-${userID}/accounts-transactions/account-${accountName}`;
    const updatedArray = [];
    return Axios.get(baseUrl).then(((response) => {
        for (let x = 0; x < response.data.length; x++) {
            updatedArray.push(
                {
                    id: response.data[x].TransactionID,
                    TransactionDate: moment(response.data[x].TransactionDate).format('YYYY-MM-DD'),
                    TransactionName: response.data[x].TransactionName,
                    Subcategory: response.data[x].SubcategoryName,
                    Outflow: response.data[x].Outflow,
                    Inflow: response.data[x].Inflow,
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