import TreeView from '@mui/lab/TreeView';
import TreeItem, {treeItemClasses} from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {ChevronRight} from '@mui/icons-material';
import Axios from 'axios';
import {useEffect} from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {styled} from '@mui/material';

const Budget = () => {

  const [categoryArray, setCategoryArray] = useState([]);

  const StyledTreeItem = styled(TreeItem)(({theme}) => ({
    [`& .${treeItemClasses.label}`]: {
      border: 'solid white 1px',
      minHeight: 25,
      borderRadius: theme.shape.borderRadius,
      marginTop: 8,
      marginBottom: 8,
      backgroundColor: 'white',
      color: 'gainsboro',
    },
  }));

  const GetCategoriesSubcategories = () => {

    const userID = localStorage.getItem('UserID');
    const baseUrl = `http://localhost:3001/category/${userID}/return-category-dictionary`;

    Axios.get(baseUrl).then((res) => {

      setCategoryArray(res.data);

    }).catch((error) => {

      alert(error);

    });
  };

  useEffect(() => {
    return () => {
      GetCategoriesSubcategories();
    };
  });

  const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  };

  const categoriesAndSubsList = (treeItems) => {
    return treeItems.map((treeItemData) => {
      let children;
      if (treeItemData.subcategory && treeItemData.subcategory.length > 0) {
        children = categoriesAndSubsList(treeItemData.subcategory);
      }
      if (treeItemData.route) {
        return (
            <Link to {...treeItemData.route}>
              <StyledTreeItem
                  key={generateKey(treeItemData.category)}
                  nodeId={treeItemData.category}
                  children={children}
                  label={treeItemData.category}
              />
            </Link>
        );
      }

      return (
          <div className="categoryRow"
               key={generateKey('categoryRow' + treeItemData.category)}>
            <div className="categoryName" key={generateKey(
                'categoryName')}> {treeItemData.category}</div>
            <div className="categoryBalance" key={generateKey(
                'categoryBalance')}>{treeItemData.balance}</div>
            <StyledTreeItem
                key={generateKey(treeItemData.category)}
                nodeId={treeItemData.category}
                children={children}
                label={'expand'}
            />
          </div>
      );
    });
  };

  return (
      <div className="budgetGrid">
        <h4>Category/subcategory name and balance</h4>
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRight/>}
            sx={{height: 300, flexGrow: 2, maxWidth: 800, overflowY: 'auto'}}
        >

          {categoriesAndSubsList(categoryArray)}

        </TreeView>

      </div>
  );
};

export default Budget;