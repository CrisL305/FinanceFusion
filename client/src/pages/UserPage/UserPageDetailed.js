import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import chevron from "../../assets/icons/chevron.svg";

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
            <>
              <div className='user-data'>
                <h2>Data for {userData.username}</h2>
                <p>Email: {userData.email}</p>
                <p>Registered on: {new Date(userData.registered_at).toLocaleDateString()}</p>
              </div>

               {/* Accounts Section */}
            <section className='profile__accounts'>
              <h3>Your Accounts <Link to={`/accounts/${id}`}><img src={chevron} alt='chevron icon' /></Link> </h3> 
              <ul>
                {accounts.map((account) => (
                  <li key={account.account_id}>
                    <strong>{account.bank_name} ({account.account_type})</strong>: ${account.balance}
                  </li>
                ))}
              </ul>
            </section>
            
            {/* Transactions Section */}
            <section className='profile__transactions'>
              <h3>Recent Transactions <Link to={`/transactions/${id}`}><img src={chevron} alt='chevron icon' /></Link></h3>
              <ul>
                {transactions.map((transaction) => (
                  <li key={transaction.transaction_id}>
                    <p><strong>{transaction.category}</strong>: ${transaction.amount}</p>
                    <p>Date: {transaction.date}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Goals Section */}
            <section className='profile__goals'>
              <h3>{userData.username}'s Goals <Link to={`/goals/${id}`}><img src={chevron} alt='chevron icon' /></Link></h3>
              <ul>
                {goals.map((goal) => (
                  <li key={goal.goal_id}>
                    <p><strong>{goal.goal_type}</strong>: ${goal.target_amount}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Budgets Section */}
            <section className='profile__budgets'>
              <h3>{userData.username}'s Budgets <Link to='/budgets'><img src={chevron} alt='chevron icon' /></Link></h3>
              <ul>
                {budgets.map((budget) => (
                  <li key={budget.budget_id}>
                    <p><strong>{budget.category}</strong>: ${budget.budgeted_amount}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Loan Section */}
            <section className='profile__loan'>
              <h3>{userData.username}'s Loans <Link to='/loans'><img src={chevron} alt='chevron icon' /></Link></h3>
              <ul>
                {loans.map((loan) => (
                  <li key={loan.loan_id}>
                    <p><strong>{loan.loan_type}</strong>: ${loan.outstanding_balance} and interest rate: {loan.interest_rate}</p>
                  </li>
                ))}                    
              </ul>
            </section>

            {/* Credit Score Section */}
            <section className='profile__loan'>
              <h3>{userData.username}'s Credit Score <Link to='/creditScore'><img src={chevron} alt='chevron icon' /></Link></h3>
              <p><strong>{creditScore.current_score}</strong></p>
            </section>

            </>
          )
     );
}
 
export default UserPageDetailed;