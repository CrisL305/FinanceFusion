import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteBtn from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/arrow_drop_down.svg";
import Modal from "../../components/Modal/Modal";
import EditData from "../../components/EditData/EditData";
import AddData from "../../components/AddData/AddData";
import axios from "axios";
import Graph from "../../components/Graph/Graph";
import { UserContext } from "../../context/UserContext";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const BudgetPage = () => {
    const { id } = useParams();
    const { setId } = useContext(UserContext);
    const [budgets, setBudgets] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [totalBudgeted, setTotalBudget] = useState(0);
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
            setTotalBudget(budgetResponse.data.reduce((acc, budget) => acc + Number(budget.budgeted_amount), 0));
            setLoading(false);
        } catch (error) {
            alert('Error fetching budget details', error);
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchBudgets();
        setId(id)
    }, [id])

    //Delete budget for the current user
    const deleteBudgets = async (budget_id) => {
        try{
        await axios.delete(`${SERVER_URL}/budgets/${id}/${budget_id}`);
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

    const pieChartData = budgets.map((budget) => ({
        name: budget.category,
        value: Number(totalBudgeted > 0
        ? ((budget.budgeted_amount / totalBudgeted) * 100).toFixed(2)
        : 0),
    }));

    if (loading) {
        return <p>Loading account details...</p>
    }
    
    return ( 
        <div className="pageDefault__holder">
            <h2 className="headerDefault font--title">Budget Details</h2>
            
            <div style={{display: "flex", justifyContent: "center", marginBottom: -25}}>
                <label className="font--title">Total Budget: ${totalBudgeted}</label>
            </div>

            <Graph
                type="pie"
                data={pieChartData}
                dataKey="value"
                xAxisKey="name"
            />

            {budgets ? (
                <>
                    <ul className="pagePadding font--normal pageDefault__listHolder">
                        {budgets.map((budget) => (
                            <li className="pageDefault__list" key={budget.budget_id}>
                                <p>Category: {budget.category}</p>
                                <p>Amount Budgeted: {budget.budgeted_amount}</p>
                                <p>Total Amount Spent: {budget.actual_spent}</p>
                                <p>Total Left Over: {budget.budgeted_amount - budget.actual_spent}</p>
                                <div className="details__delete" onClick={() => {handleBudgetDelete(budget.budget_id)}}>
                                    <img className="details__icon" src={DeleteBtn} alt="delete_button" /> Delete This Budget
                                </div>
                                <div className="details__edit" onClick={() => {handleBudgetEdit(budget)}}>
                                    <img className="details__icon" src={Edit} alt="edit_button" /> Edit This Budget
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