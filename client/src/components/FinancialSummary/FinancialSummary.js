import "./FinancialSummary.scss";

const FinancialSummary = ({ accounts, goals, budgets, transactions, creditScore }) => {
    //Calculate total balance across all accounts
    const totalBalace = accounts.reduce((sum, account) => 
        sum + Number(account.balance || 0), 0);

    //Calculate progress towards savings goals
    const totalSavingsGoal = goals.reduce((sum, goal) => sum + Number(goal.target_amount), 0);
    const currentSavings = goals.reduce((sum, goal) => sum + Number(goal.current_savings), 0);
    const savingsProgress = totalSavingsGoal
        ? Math.round((currentSavings / totalSavingsGoal) * 100)
        : 0;
    
    //Get upcoming bills from transactions 
    const today = new Date();
    const upcomingBills = transactions.filter(
        (transaction) =>
            transaction.transaction_type === "expense" &&
        new Date(transaction.date) > today &&
        new Date(transaction.date) < new Date(today.setDate(today.getDate() + 7))
    );

    //Calculate budget remaining for the month
    const totalBudgeted = budgets.reduce((sum, budget) => 
        sum + Number(budget.budgeted_amount || 0), 0);
    const totalSpent = budgets.reduce((sum, budget) => 
        sum + Number(budget.actual_spent || 0), 0);
    const budgetRemaining = totalBudgeted - totalSpent;

    return (
        <div>
            <h2 className="financialSummary__title font--title">Financial Status Summary</h2>
            <div className="financialSummary">
            <div className="summaryCard font--normal">
                <h3 className="summaryCard__title">Total Balance</h3>
                <p className="summaryCard__paragraphs">${totalBalace.toFixed(2)}</p>
            </div>
            <div className="summaryCard font--normal">
                <h3 className="summaryCard__title">Savings Progress</h3>
                <div>
                    <div
                    className="progressBar__progress "
                    style={{ width: `${savingsProgress}%`}}
                    ></div>
                </div>
                <p className="summaryCard__paragraphs">{savingsProgress}% Saved</p>
            </div>
            <div className="summaryCard font--normal">
                <h3 className="summaryCard__title">Upcoming Bills</h3>
                {upcomingBills.length > 0 ? (
                    <ul>
                        {upcomingBills.map((bill) => (
                             <li className="summaryCard__paragraphs" key={bill.transaction_id}>
                             {bill.category}: ${bill.amount} - Due on{" "}
                             {new Date(bill.date).toLocaleDateString()}
                         </li>
                     ))}
                    </ul>
                ) : (
                    <p className="summaryCard__paragraphs">No bills this week</p>
                )} 
            </div>
            <div className="summaryCard font--normal">
                <h3 className="summaryCard__title">Account Health</h3>
                <p className="summaryCard__paragraphs summaryCard__paragraphs--budget">Budget Left: <span className={budgetRemaining >= 0 ? "budgetGreen": "budgetRed"}>${budgetRemaining.toFixed(2)}</span></p>
                <p className="summaryCard__paragraphs summaryCard__paragraphs--credit">Credit Score: {creditScore.current_score}</p>
            </div>
            </div>

        </div>
      );
};
 
export default FinancialSummary;