import { useEffect, useState } from "react";
import AddData from '../../components/AddData/AddData'
import axios from "axios";
import { useParams } from "react-router-dom";


const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const GoalsPage = ( ) => {
    const { id } = useParams();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
   
    //Fetch Goals for the current account

    const fetchGoals = async () => {
        try {
          const goalsResponse = await axios.get(`${SERVER_URL}/goals/${id}`)
          setGoals(goalsResponse.data);
          setLoading(false);
        } catch (error) {
          setError('Error fetching account details')
          setLoading(false);
        }
      };

    useEffect(() => {
      fetchGoals();
    }, [id]);
  
    if (loading) {
        return <p>Loading Goals</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    const formFields = [
      {name: 'goal_type', label: 'Goal_type', type: 'text'},
      {name: 'target_amount', label: 'Target_amount', type: 'number'},
      {name: 'current_savings', label: 'Current_savings', type: 'number'},
      {name: 'deadline', label: 'Deadline', type: 'date'}
    ];
  
      return (
          <>
            <div>
              <h2>Account Goals</h2>
              <ul>
                {goals.map((goal) => (
                  <li key={goal.goal_id}>
                      {goal.goal_type}: 
                        Amount Saved: ${goal.target_amount}
                        <br />
                        Current Savings: ${goal.current_savings}
                  </li>
                ))}
              </ul>
  
              <AddData
                idType="user_id"
                idValue={id}
                formFields={formFields}
                endpoint="/goals"
                onDataAdded={fetchGoals}
              />
            </div>
          </>
        );
}
 
export default GoalsPage;