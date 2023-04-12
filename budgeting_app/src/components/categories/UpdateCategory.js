import {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import {Select} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


const UpdateCategory = ({setAddDashboardSuccess, setMessage, setEffectOpen}) => {
    const [open, setOpen] = useState(false);
    const [Category, setCategory] = useState('');
    const [balance, setBalance] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCategory('');
        setBalance('');
        setSelectedCategory('');
    };

    const handleDelete = () => {
        const userID = localStorage.getItem('UserID');
        const postUrl = 'http://localhost:3001/category/delete-category';
        Axios.post(postUrl, {
            CategoryName: selectedCategory,
            UserID: userID,
        }).then(() => {
            setOpen(false);
            setCategory('');
            setBalance('');
            setSelectedCategory('');
            setAddDashboardSuccess(true)
            setMessage('Category was deleted')
            setEffectOpen(true)
        }).catch((response) => {
            alert(response.response.data);
        });
    };

    const handleEditCategory = () => {
        const userID = localStorage.getItem('UserID');
        const postUrl = 'http://localhost:3001/category/update-category';
        Axios.post(postUrl, {
            OldCategoryName: selectedCategory,
            NewCategoryName: Category,
            UserID: userID,
        }).then(() => {
            alert('Edit successful');
            setOpen(false);
            setCategory('');
            setBalance('');
            setSelectedCategory('');
            setAddDashboardSuccess(true)
            setMessage('Category was edited')
            setEffectOpen(true)
        }).catch((response) => {
            alert(response.response.data);
        });
    }

    const getUserCategories = () => {
        const userID = localStorage.getItem('UserID');
        const baseUrl = `http://localhost:3001/category/${userID}`;
        const updatedArray = [];
        Axios.get(baseUrl).then((response) => {
            for (let x = 0; x < response.data.length; x++) {
                if (response.data[x].CategoryName.toString() !== 'Available') {
                    const category = response.data[x].CategoryName;
                    updatedArray.push({value: category});
                }
            }
            setCategoryList(updatedArray);
        }).catch((response) => {
            alert(response.response.data);
        });
    };

    useEffect(() => {
        getUserCategories();
    }, [open]);

    return (
        <div className="subcategory-button">
            <Button id="subcategory-button-1" sx={{fontSize: "13px"}} onClick={handleClickOpen}>
                <EditIcon sx={{fontSize: "18px", marginLeft: "-2px", marginRight: "8px"}}/> Edit category
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit category</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To edit a category, you need to select a
                        category. You can
                        change category
                        name if it is needed. It is also possible to delete
                        subcategory by
                        pressing the delete button.
                    </DialogContentText>

                    <FormControl required margin="dense">
                        <InputLabel
                            id="SubCategory-type-label">Category</InputLabel>
                        <Select
                            style={{height: '50px', width: '200px'}}
                            labelId="Category-type-label"
                            id="Category"
                            fullWidth
                            value={selectedCategory}
                            onChange={(event) => {
                                setSelectedCategory(event.target.value);
                            }}
                        >
                            {categoryList.map((category) => (
                                <MenuItem key={category.value}
                                          value={category.value}>
                                    {category.value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="category"
                        label="Category name"
                        fullWidth
                        inputProps={{maxLength: 50}}
                        value={Category}
                        variant="filled"
                        onChange={(event) => {
                            setCategory(event.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions style={{justifyContent: "space-between"}}>
                    <Button onClick={handleDelete} className="delete-button" style={{ color: "red", backgroundColor: "#ffebee" }}>
                        Delete
                    </Button>
                    <div>
                    <Button onClick={handleClose} className="cancel-button">
                        Cancel
                    </Button>
                    <Button onClick={handleEditCategory}
                            className="Save-button">
                        Save changes
                    </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UpdateCategory;