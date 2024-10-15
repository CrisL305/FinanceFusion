import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteBtn from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/arrow_drop_down.svg";
import Modal from "../../components/Modal/Modal";
import EditData from "../../components/EditData/EditData";
import AddData from "../../components/AddData/AddData";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const BudgetPage = () => {
    const { id } = useParams();
    const [budgets, setBudgets] = useState({});
    const [selectedBudget, setSelectedBudget] = useState(null)
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //Fields for editing Budgets
    const budgetFormFields = [
        {name: 'category', label: 'Category', type: 'text' },
        {name: 'budgeted_amount', label: 'Budgeted Amount', type: 'number' },
        {name: 'actual_spent', label: 'Money Spent', type: 'number' },

    ]

    const fetchBudgets = async () => {
        try {
            const budgetResponse = await axios.get(`${SERVER_URL}/budgets/${id}`);
            setBudgets(budgetResponse.data);
            setLoading(false);
        } catch (error) {
            alert('Error fetching budget details', error);
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchBudgets();
    }, [id])

    //Delete budget for the current user
    const deleteBudgets = async (budget_id) => {
        try{
        const response = await axios.delete(`${SERVER_URL}/budgets/${id}/${budget_id}`);
        fetchBudgets();
    } catch (error) {
        alert('Error deleting budget:', error);
    }
    } 

    //Handler for deleting budget
    const handleBudgetDelete = (budgetId) => {
        deleteBudgets(budgetId)
    }

    //Handler for editing budget & opening modal
    const handleBudgetEdit = (budget) => {
        setSelectedBudget(budget);
        setIsModalOpen(true);
    }

    //Close the Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBudget(null);
    }

    if (loading) {
        return <p>Loading account details...</p>
    }
    
    return ( 
        <div>
            <h2>Budget Details</h2>
            {budgets ? (
                <>
                    <ul>
                        {budgets.map((budget) => (
                            <li key={budget.budget_id}>
                                <p>Category: {budget.category}</p>
                                <p>Amount Budgeted: {budget.budgeted_amount}</p>
                                <p>Total Amount Spent: {budget.actual_spent}</p>
                                <p>Total Left Over: {budget.budgeted_amount - budget.actual_spent}</p>
                                <div onClick={() => {handleBudgetDelete(budget.budget_id)}}>
                                    <img src={DeleteBtn} alt="delete_button" /> Delete This Budget
                                </div>
                                <div onClick={() => {handleBudgetEdit(budget)}}>
                                    <img src={Edit} alt="edit_button" /> Edit This Budget
                                </div>
                            </li>
                        ))}
                    </ul>
                     {/* Modal for Editing Budgets */}
                     <Modal show={isModalOpen} onClose={closeModal}>
                     {selectedBudget && (
                         <EditData
                            idType="id"
                            idValue={selectedBudget.budget_id}
                            formFields={budgetFormFields}
                            endpoint={`/budgets/${id}`}
                            initialData={selectedBudget}
                            onDataUpdated={() => {
                            fetchBudgets();
                            closeModal();
                            }}
                        />
                        )}
                        </Modal>
                    <AddData
                        idType="id"
                        idValue={id}
                        formFields={budgetFormFields}
                        endpoint="/budgets/"
                        onDataAdded={fetchBudgets}
                    />
                </>        
            ):(
                <p>No budget found.</p>
            )}
        </div>
     );
    
}
 
export default BudgetPage;