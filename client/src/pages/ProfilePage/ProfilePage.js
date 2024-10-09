import { useEffect, useState } from 'react';
import axios from 'axios';
import Btn from '../../components/Btn/Btn';
import UserCard from '../../components/CardComponent/CardComponent';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const ProfilePage = () => {

  
    
  //State variables to track authentication, login status, and user profile data
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);

  //State for profile data
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [creditScore, setCreditScore] = useState([]);
  const [loading, setLoading] = useState(true);

  //Dummy data to then change into dynamic data
  const users = [
    {userId: 1, name: 'John Doe'},
    {userId: 2, name: 'Jane Smith'}
  ];

  //Function to handle when a user selects a card
  const handleUserSelection = (userId) => {
    setSelectedUserId(userId);
    fetchUserData(userId);
  }

  useEffect(() => {
    // Send a GET request for profile information
    // If user is currently logged in, we will get profile data, if they are not logged in, we will get 401 (Unauthorized) that we can handle in `.catch`
    // Note that we need to use `withCredentials` in order to pass the cookie to a server
    axios
      .get(`${SERVER_URL}/auth/profile`, { withCredentials: true })
      .then((res) => {
        // Update the state: done authenticating, user is logged in, set the profile data
        setIsAuthenticating(false);
        setIsLoggedIn(true);
        setProfileData(res.data);
      })
      .catch((err) => {
        // If we are getting back 401 (Unauthorized) back from the server, means we need to log in
        if (err.response.status === 401) {
          // Update the state: done authenticating, user is not logged in
          setIsAuthenticating(false);
          setIsLoggedIn(false);
        } else {
          console.log('Error authenticating', err);
        }
      });
  }, []);

  //Fetch all profile data
  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      //Fetch user profile
      const userResponse = await axios.get(`${SERVER_URL}/users/${userId}`);
      setUserData(userResponse.data);

      //Fetch user accounts
      const accountsResponse = await axios.get(`${SERVER_URL}/accounts/${userId}`);
      setAccounts(accountsResponse.data);

      //fetch user transactions
      const transactionsResponse = await axios.get(`${SERVER_URL}/transactions/account/${userId}`);
      setTransactions(transactionsResponse.data);

      //fetch user goals
      const goalsResponse = await axios.get(`${SERVER_URL}/goals/${userId}`);
      setGoals(goalsResponse.data);

      //fetch user budgets
      const budgetsResponse = await axios.get(`${SERVER_URL}/budgets/${userId}`);
      setBudgets(budgetsResponse.data);

      //fetch user loans
      const loansResponse = await axios.get(`${SERVER_URL}/loans/${userId}`);
      setLoans(loansResponse.data);

      //fetch user credit
      const creditResponse = await axios.get(`${SERVER_URL}/creditscores/${userId}`);
      setCreditScore(creditResponse.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }

  //While authenticating, don't render anything
  if (isAuthenticating) {
    return null;
  }

  const formatDate = (date) => {
    // Return date formatted as 'month/day/year'
    return new Date(date).toLocaleDateString('en-US');
  };

  // While the component is authenticating, do not render anything (alternatively, this can be a preloader)
  if (isAuthenticating) return null;

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      {/* If user is logged in, render their profile information */}
      {isLoggedIn ? (
        profileData && (
          <>
            <h2>Hello, {profileData.username}</h2>
            <h3>Registered since: {formatDate(profileData.updated_at)}</h3>
            <img
              className="profile-page__avatar"
              src={profileData.avatar_url}
              alt={`${profileData.username} avatar`}
            />
            <div className="profile-page__logout-wrapper">
              {/* Render a logout button */}
              <Btn content="Logout" login={false} logout={true}/>
            </div>
            {/* Display user cards for selection if no user is selected yet */}
            {!selectedUserId ? (
              <div className='user-selection'>
                <h2>Select a user to view data:</h2>
                <div className='user-cards'>
                  {users.map((user) => (
                    <UserCard 
                    key={user.userId}
                    userId={user.userId}
                    name={user.name}
                    onClick={handleUserSelection}
                    />
                  ))}
                </div>
              </div>
            ) : (
              //Shows loading state if data is still being fetched
              loading ? (
                <p>Loading data for user {selectedUserId}...</p>
              
            ) : (
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
                  <h3>Your Accounts</h3>
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
                  <h3>Recent Transactions</h3>
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
                  <h3>{userData.username}'s Goals</h3>
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
                  <h3>{userData.username}'s Budgets</h3>
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
                  <h3>{userData.username}'s Loans</h3>
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
                  <h3>{userData.username}'s Credit Score</h3>
                  <p><strong>{creditScore.current_score}</strong></p>
                </section>

                </>
              )
            ) 
            )}
          </>
        )
      ) : (
        <>
          <p>
            <strong>This page requires authentication.</strong>
          </p>
          <Btn content="Login with Github" login={true} logout={false} />
        </>
      )}
    </div>
  );
};

export default ProfilePage;