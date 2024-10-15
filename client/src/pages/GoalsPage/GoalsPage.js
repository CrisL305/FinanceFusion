import { useEffect, useState } from "react";
import AddData from '../../components/AddData/AddData'
import axios from "axios";
import { useParams } from "react-router-dom";
import EditData from "../../components/EditData/EditData";
import DeleteBtn from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/arrow_drop_down.svg";
import Modal from "../../components/Modal/Modal";


const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const GoalsPage = ( ) => {
    const { id } = useParams();
    const [goals, setGoals] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
   
    //Fetch Goals for the current account

    const fetchGoals = async () => {
        try {
          const goalsResponse = await axios.get(`${SERVER_URL}/goals/${id}`)
          setGoals(goalsResponse.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      };

       //Delete account for the current user
       const deleteGoal = async (goal_id) => {
        try{
            await axios.delete(`${SERVER_URL}/goals/${id}/${goal_id}`)
            fetchGoals();
        } catch (error) {
            console.error ('Error deleting transactions:', error);
        }
    }

    useEffect(() => {
      fetchGoals();
    }, [id]);

    const handleGoalDelete = (goal_id) => {
      deleteGoal(goal_id);
    }
  
    //Handle transaction click to edit it
    const handleGoalEdit = (goal) => {
      setSelectedGoal(goal);
      setIsModalOpen(true);
    }
  
    //Close the modal
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedGoal(null);
    }
  
    if (loading) {
        return <p>Loading Goals</p>
    }

    const goalsFormFields = [
      {name: 'goal_type', label: 'Goal_type', type: 'text'},
      {name: 'target_amount', label: 'Target_amount', type: 'number'},
      {name: 'current_savings', label: 'Current_savings', type: 'number'},
      {name: 'deadline', label: 'Deadline', type: 'date'}
    ];
  
      return (
          <>
            <div>
              <h2>Goals</h2>
              {goals ? (
                <>
                <ul>
                {goals.map((goal) => (
                    <li key={goal.goal_id}>
                        <p>Goal: {goal.goal_type}</p>
                    <p>Goal Amount: {goal.target_amount}</p>
                    <p>Current Savings: ${goal.current_savings}</p>
                    <p>Deadline: {goal.deadline}</p>
                    <div onClick={() => {handleGoalDelete(goal.goal_id)}}>
                      <img src={DeleteBtn} alt="delete button" />Delete This Goal</div>
                    <div onClick={() => {handleGoalEdit(goal)}}>
                      <img src={Edit} alt="edit button" />Edit this Goal</div>
                    </li>
                ))}
                </ul>
                {/* Modal for Editing Transactions */}
            <Modal show={isModalOpen} onClose={closeModal}>
              {selectedGoal && (
                <EditData
                  idType="id"
                  idValue={selectedGoal.goal_id}
                  formFields={goalsFormFields}
                  endpoint={`/goals/${id}`}
                  initialData={selectedGoal}
                  onDataUpdated={() => {
                    fetchGoals();
                    closeModal();
                  }}
                />
                
              )}
            </Modal>
                </>
            ) : (
                <p>No account found.</p>
            )}
            <AddData
                idType="id"
                idValue={id}
                formFields={goalsFormFields}
                endpoint="/goals/"
                onDataAdded={fetchGoals}
            />
            </div>
          </>
        );
}
 
export default GoalsPage;