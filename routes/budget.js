const express = require('express');
const router = express.Router();
const pool = require('../helpers/database');

//Changes date format
const moment = require('moment');

/**
 * Get users all budgets
 */
router.get('/:id', async (req, res) => {
  try {
    const sqlQuery = `SELECT budget.Amount, budget.ToCategory, budget.FromCategory, budget.BudgetDate FROM budget 
INNER JOIN mergebsc ON budget.BudgetID = mergebsc.BudgetID 
INNER JOIN subcategory ON mergebsc.FromSubCategoryID = subcategory.SubCategoryID 
WHERE subcategory.UserID=?`;

    const rows = await pool.query(sqlQuery, req.params.id);

    //For changing date-format to YYYY-MM-DD
    for (let i = 0; i < rows.length; i++) {
      rows[i].BudgetDate = moment(rows[i].BudgetDate).format('YYYY-MM-DD');
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send('Something went wrong, please try again');
  }
});

/**
 * Get budgeted amount for goal type 2
 */
router.get('/user-:UserID/get-budgeted-sum-type-2/subcategory-:SubCategoryName', async (req, res) => {
  try {
    const userID = req.params.UserID
    const subCategoryName = req.params.SubCategoryName;

    const budgetedTo = `SELECT SUM(budget.Amount) As 'Budgeted' 
from subcategory 
INNER JOIN mergebsc ON subcategory.SubCategoryID = mergebsc.ToSubCategoryID 
INNER JOIN budget ON mergebsc.BudgetID = budget.BudgetID 
INNER JOIN user ON subcategory.UserID = user.UserID 
INNER JOIN goal ON subcategory.SubCategoryID = goal.SubCategoryID 
WHERE user.UserID = '${userID}' AND subcategory.SubcategoryName = '${subCategoryName}' AND goal.GoalDate > budget.BudgetDate;`
    const budgetedToResult = await pool.query(budgetedTo);

    const budgetedFrom = `SELECT SUM(budget.Amount) As 'Budgeted' 
from subcategory 
INNER JOIN mergebsc ON subcategory.SubCategoryID = mergebsc.FromSubCategoryID 
INNER JOIN budget ON mergebsc.BudgetID = budget.BudgetID 
INNER JOIN user ON subcategory.UserID = user.UserID 
INNER JOIN goal ON subcategory.SubCategoryID = goal.SubCategoryID 
WHERE user.UserID = '${userID}' AND subcategory.SubcategoryName = '${subCategoryName}' AND goal.GoalDate > budget.BudgetDate;`
    const budgetedFromResult = await pool.query(budgetedFrom);

    const result = budgetedToResult[0].Budgeted - budgetedFromResult[0].Budgeted
    res.status(200).json(result);
  } catch (error) {
    res.status(400).send('Something went wrong, please try again');
  }
});

/**
 * Get budgeted amount for goal type 3
 */
router.get('/user-:UserID/get-budgeted-sum-type-3/subcategory-:SubCategoryName', async (req, res) => {
  try {
    const userID = req.params.UserID
    const subCategoryName = req.params.SubCategoryName;

    const budgetedTo = `SELECT SUM(budget.Amount) As 'Budgeted' 
from subcategory 
INNER JOIN mergebsc ON subcategory.SubCategoryID = mergebsc.ToSubCategoryID 
INNER JOIN budget ON mergebsc.BudgetID = budget.BudgetID 
INNER JOIN user ON subcategory.UserID = user.UserID 
INNER JOIN goal ON subcategory.SubCategoryID = goal.SubCategoryID 
WHERE user.UserID = '${userID}' AND subcategory.SubcategoryName = '${subCategoryName}';`
    const budgetedToResult = await pool.query(budgetedTo);

    const budgetedFrom = `SELECT SUM(budget.Amount) As 'Budgeted' 
from subcategory 
INNER JOIN mergebsc ON subcategory.SubCategoryID = mergebsc.FromSubCategoryID 
INNER JOIN budget ON mergebsc.BudgetID = budget.BudgetID 
INNER JOIN user ON subcategory.UserID = user.UserID 
INNER JOIN goal ON subcategory.SubCategoryID = goal.SubCategoryID 
WHERE user.UserID = '${userID}' AND subcategory.SubcategoryName = '${subCategoryName}';`
    const budgetedFromResult = await pool.query(budgetedFrom);

    const result = budgetedToResult[0].Budgeted - budgetedFromResult[0].Budgeted
    res.status(200).json(result);
  } catch (error) {
    res.status(400).send('Something went wrong, please try again');
  }
});


/**
 * Add new budget (transfer money from x-category to y-category)
 */
router.post('/new-budget', async (req, res) => {
  try {
    const {
      Amount,
      BudgetDate,
      FromSubCategory,
      ToSubCategory,
      UserID,
        Type
    } = req.body;

    //if type is 1, it's for deleting subcategory (Not to reduce balance from Subcategory)

    const insertBudget = `INSERT INTO budget (Amount, BudgetDate, FromCategory, ToCategory) VALUES (?, ?, ?, ?)`;
    const rows = await pool.query(insertBudget,
        [Amount, BudgetDate, FromSubCategory, ToSubCategory]);

    const budgetID = rows.insertId;
    const fromSubCategoryIDQuery = `SELECT subcategory.SubCategoryID from subcategory WHERE subcategory.SubCategoryName = '${FromSubCategory}' AND subcategory.UserID = '${UserID}'`;
    const toSubCategoryIDQuery = `SELECT subcategory.SubCategoryID from subcategory WHERE subcategory.SubCategoryName = '${ToSubCategory}' AND subcategory.UserID = '${UserID}'`;
    const FromSubCategoryIDResult = await pool.query(fromSubCategoryIDQuery);
    const ToSubCategoryIDResult = await pool.query(toSubCategoryIDQuery);
    const FromSubCategoryID = FromSubCategoryIDResult[0].SubCategoryID;
    const ToSubCategoryID = ToSubCategoryIDResult[0].SubCategoryID;

    const insertMergebsc = `INSERT INTO mergebsc(mergebsc.BudgetID, mergebsc.FromSubCategoryID, mergebsc.ToSubCategoryID) VALUES (${budgetID}, ?, ?);`;
    await pool.query(insertMergebsc, [FromSubCategoryID, ToSubCategoryID]);

    if(Type !== 1) {
      const updateFromBalance = `UPDATE subcategory 
SET SubCategory.Balance = (SELECT SubCategory.Balance FROM subcategory WHERE subcategory.SubCategoryID = ${FromSubCategoryID}) - ${Amount} 
WHERE subcategory.SubCategoryID = ${FromSubCategoryID}`;
      await pool.query(updateFromBalance);
    }
    const updateToBalance = `UPDATE subcategory 
SET SubCategory.Balance = (SELECT SubCategory.Balance FROM subcategory WHERE subcategory.SubCategoryID = ${ToSubCategoryID}) + ${Amount} 
WHERE subcategory.SubCategoryID = ${ToSubCategoryID}`;
    await pool.query(updateToBalance);

    const budgetIDtoString = budgetID.toString();
    res.status(200).json({budgetID: budgetIDtoString});

  } catch (error) {
    res.status(400).send('Something went wrong, please try again');
  }
});

module.exports = router;