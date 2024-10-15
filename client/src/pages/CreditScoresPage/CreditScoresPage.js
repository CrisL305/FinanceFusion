import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Deletebtn from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/arrow_drop_down.svg";
import EditData from "../../components/EditData/EditData";
import AddData from "../../components/AddData/AddData";
import Modal from "../../components/Modal/Modal";



const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const CreditScorePage = () => {
    const { id } = useParams();
    const [creditScore, setCreditScore] = useState(null);
    const [selectedCreditScore, setSelectedCreditScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //Fields for editing Credit Score
    const creditScoreFormField = [
        {name: "current_score", label: "Credit Score", type: 'text'},
        {name: "score_history", label: "Credit Score History", type: 'text'},
        {name: "credit_utilization", label: "Credit Usage", type: 'number'}
    ]

    //Fetch Credit Score
    const fetchCreditScore = async () => {
        try {
            const creditScoreResponse = await axios.get(`${SERVER_URL}/creditscores/${id}`);
            setCreditScore(creditScoreResponse.data);
            setLoading(false);
        } catch (error) {
            alert("Error fetching Credit Score", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCreditScore();
    }, [id]);

    //Delete Credit Score
    const deleteCreditScore = async (score_id) => {
        try{
            const deleteScore = await axios.delete(`${SERVER_URL}/creditscores/${id}/${score_id}`);
            fetchCreditScore();
        } catch (error) {
            alert('Error Deleting Credit Score:', error);
        }
    }

    //Handler for Deleting Credit Score
    const handleCreditScoreDelete = (score_id) =>{
        deleteCreditScore(score_id);
    }

    //Handler for Editing Credit Score & Opening Modal
    const handleCreditScoreEdit = (credit) => {
        setSelectedCreditScore(credit);
        setIsModalOpen(true);
    }

    //Close the Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCreditScore(null);
    }

    if (loading) {
        return <p>Loading Credit Score Details...</p>
    }

    return ( 
        <div>
            <h2>Credit Score Details</h2>
            {creditScore ? (
                <div>
                    <p>Current Credit Score: {creditScore.current_score}</p>
                    <p>Credit Score History:</p>
                    <ul>
                        {Array.isArray(creditScore.score_history) ? (
                            creditScore.score_history.map((historyItem, index) => (
                                <li key={index}>
                                    Date: {historyItem.date}, Score: {historyItem.score}
                                </li>
                            ))
                        ) : (
                            <li>No history available.</li>
                        )}
                    </ul>
                    <p>Credit Usage: {creditScore.credit_utilization}</p>
                    <div onClick={() => {handleCreditScoreDelete(creditScore.score_id)}}>
                        <img src={Deletebtn} alt="delete_button" /> Delete This Credit Score
                    </div>
                    <div onClick={() => {handleCreditScoreEdit(creditScore)}}>
                        <img src={Edit} alt="edit_button" /> Edit This Credit Score
                    </div>
                    
                    {/* Modal for Editing Credit Score */}
                    <Modal show={isModalOpen} onClose={closeModal}>
                     {selectedCreditScore && (
                         <EditData
                            idType="id"
                            idValue={selectedCreditScore.score_id}
                            formFields={creditScoreFormField}
                            endpoint={`/creditscores/${id}`}
                            initialData={selectedCreditScore}
                            onDataUpdated={() => {
                            fetchCreditScore();
                            closeModal();
                            }}
                        />
                        )}
                        </Modal>
                </div>
            ):(
                <p>No Credit Score found.</p>
            )}

            {/* Add Data Form */}
            <AddData
                idType="id"
                idValue={id}
                formFields={creditScoreFormField}
                endpoint="/creditscores/"
                onDataAdded={fetchCreditScore}
            />
        </div>
     );
}
 
export default CreditScorePage;