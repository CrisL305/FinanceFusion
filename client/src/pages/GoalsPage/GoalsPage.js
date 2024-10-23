import { useContext, useEffect, useState } from "react";
import AddData from '../../components/AddData/AddData'
import axios from "axios";
import { useParams } from "react-router-dom";
import EditData from "../../components/EditData/EditData";
import DeleteBtn from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/arrow_drop_down.svg";
import Modal from "../../components/Modal/Modal";
import Graph from "../../components/Graph/Graph";
import { UserContext } from "../../context/UserContext";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const GoalsPage = ( ) => {
    const { id } = useParams();
    const { setId } = useContext(UserContext);
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
      setId(id);
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
      {name: 'goal_type', label: 'Goal', type: 'text'},
      {name: 'target_amount', label: 'Target Amount', type: 'number'},
      {name: 'current_savings', label: 'Current Savings', type: 'number'},
      {name: 'deadline', label: 'Deadline', type: 'date'}
    ];
  
    //Data Goals Transformation for Graph
    const transformGoalData = (goals) => {
      return goals.map((goal) => ({
        name: goal.goal_type,
        saved: Number(goal.current_savings),
        target: Number(goal.target_amount),
      }));
    };

    const chartData = transformGoalData(goals);

      return (
          <>
            <div className="pageDefault__holder">
              <h2 className="headerDefault font--title">Goals</h2>
              <Graph
                type='bar'
                data={chartData}
                dataKey='saved'
                xAxisKey='name'
              />
              {goals ? (
                <>
                <ul className="pagePadding font--normal pageDefault__listHolder">
                {goals.map((goal) => (
                    <li className="pageDefault__list" key={goal.goal_id}>
                        <p>Goal: {goal.goal_type}</p>
                    <p>Goal Amount: {goal.target_amount}</p>
                    <p>Current Savings: ${goal.current_savings}</p>
                    <p>Deadline: {new Date(goal.deadline).toLocaleDateString('en-US')}</p>
                    <div className="details__delete" onClick={() => {handleGoalDelete(goal.goal_id)}}>
                      <img className="details__icon" src={DeleteBtn} alt="delete button" />Delete This Goal</div>
                    <div className="details__edit" onClick={() => {handleGoalEdit(goal)}}>
                      <img className="details__icon" src={Edit} alt="edit button" />Edit this Goal</div>
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