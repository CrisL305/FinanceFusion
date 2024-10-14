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
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const fetchUserData = async () => {
      //Fetch Users
      const userResponse = await axios.get(`${SERVER_URL}/users`);
              setUsers(userResponse.data);
    }
    fetchUserData();
  }, [])
  //While authenticating, don't render anything
  if (isAuthenticating) {
    return null;
  }

  const formatDate = (date) => {
    // Return date formatted as 'month/day/year'
    return new Date(date).toLocaleDateString('en-US');
  };
  
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
                <div className='user-selection'>
                <h2>Select a user to view data:</h2>
                  {users.map((user) => (
                    <div key={user.userId} className='user-cards'>
                    <UserCard 
                    id={user.id}
                    userId={user.id}
                    content={user.username}
                    linkPath={"users"}
                    />
                    </div>
                  ))}
              </div>
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