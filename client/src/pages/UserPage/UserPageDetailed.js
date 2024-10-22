import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import chevron from "../../assets/icons/chevron.svg";
import FinancialSummary from "../../components/FinancialSummary/FinancialSummary";
import "./UserPageDetailed.scss";

const UserPageDetailed = ( ) => {

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [goals, setGoals] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loans, setLoans] = useState([]);
    const [creditScore, setCreditScore] = useState([]);
    const [loading, setLoading] = useState(true);

    //Fetch all profile data
    useEffect(()=> {
        const fetchUserData = async () => {
            setLoading(true);
            try {      
              
              //Fetch user 
              const usersResponse = await axios.get(`${SERVER_URL}/users/${id}`);
              setUserData(usersResponse.data);
              
              //Fetch user accounts
              const accountsResponse = await axios.get(`${SERVER_URL}/accounts/${id}`);
              setAccounts(accountsResponse.data);
        
              //fetch user transactions
              const transactionsResponse = await axios.get(`${SERVER_URL}/transactions/account/${id}`);
              setTransactions(transactionsResponse.data);
        
              //fetch user goals
              const goalsResponse = await axios.get(`${SERVER_URL}/goals/${id}`);
              setGoals(goalsResponse.data);
        
              //fetch user budgets
              const budgetsResponse = await axios.get(`${SERVER_URL}/budgets/${id}`);
              setBudgets(budgetsResponse.data);
        
              //fetch user loans
              const loansResponse = await axios.get(`${SERVER_URL}/loans/${id}`);
              setLoans(loansResponse.data);
        
              //fetch user credit
              const creditResponse = await axios.get(`${SERVER_URL}/creditscores/${id}`);
              setCreditScore(creditResponse.data);
        
              setLoading(false);
            } catch (error) {
              console.error("Error fetching data:", error);
              setLoading(false);
            }
          };
          fetchUserData();
        }, [id]);
 
        if (loading) {
            return <p>Loading user data...</p>
        }

    return ( 
        //Display the user data once it's fetched
        userData && (
            <div className="pagePadding font--normal">
              <FinancialSummary 
              accounts={accounts}
              goals={goals}
              budgets={budgets}
              transactions={transactions}
              creditScore={creditScore}
              />
            <div className="profile__holder--main">
               {/* Accounts Section */}
            <section className='profile__holder'>
            <Link className="profile__link" to={`/accounts/${id}`}><h3>Your Accounts<img className="profile__icon" src={chevron} alt='chevron icon' /></h3></Link>
              <ul className='profile__holder__listStyle'>
                {accounts.slice(0, 2).map((account) => (
                  <li key={account.account_id}>
                    <strong>{account.bank_name}</strong>: ${account.balance}
                  </li>
                ))}
              </ul>

            </section>
            
            {/* Transactions Section */}
            <section className='profile__holder'>
            <Link className="profile__link" to={`/transactions/${id}`}><h3>Recent Transactions <img className="profile__icon" src={chevron} alt='chevron icon' /></h3></Link>
              <ul className='profile__holder__listStyle'>
                {transactions.slice(0, 2).map((transaction) => (
                  <li key={transaction.transaction_id}>
                    {transaction.category}: ${transaction.amount}
                  </li>
                ))}
              </ul>
            </section>

            {/* Goals Section */}
            <section className='profile__holder'>
            <Link className="profile__link" to={`/goals/${id}`}><h3>{userData.username}'s Goals <img className="profile__icon" src={chevron} alt='chevron icon' /></h3></Link>
              <ul className='profile__holder__listStyle'>
                {goals.slice(0, 2).map((goal) => (
                  <li key={goal.goal_id}>
                    <p><strong>{goal.goal_type}</strong>: ${goal.target_amount}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Budgets Section */}
            <section className='profile__holder'>
            <Link className="profile__link" to={`/budgets/${id}`}><h3>{userData.username}'s Budgets <img className="profile__icon" src={chevron} alt='chevron icon' /></h3></Link>
              <ul className='profile__holder__listStyle'>
                {budgets.slice(0, 2).map((budget) => (
                  <li key={budget.budget_id}>
                    <p><strong>{budget.category}</strong>: ${budget.budgeted_amount}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Loan Section */}
            <section className='profile__holder'>
            <Link className="profile__link" to={`/loans/${id}`}><h3>{userData.username}'s Loans <img className="profile__icon" src={chevron} alt='chevron icon' /></h3></Link>
              <ul className='profile__holder__listStyle'>
                {loans.slice(0, 2).map((loan) => (
                  <li key={loan.loan_id}>
                    <p><strong>{loan.loan_type}</strong>: ${loan.outstanding_balance} <br/> <strong>Interest rate:</strong> {loan.interest_rate}</p>
                  </li>
                ))}                    
              </ul>
            </section>

            {/* Credit Score Section */}
            <section className='profile__holder'>
            <Link className="profile__link" to={`/creditscores/${id}`}><h3>{userData.username}'s Credit Score <img className="profile__icon" src={chevron} alt='chevron icon' /></h3></Link>
              <p><strong>{creditScore.current_score}</strong></p>
            </section>
            </div>
            </div>
          )
     );
}
 
export default UserPageDetailed;