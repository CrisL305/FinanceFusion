import { useEffect, useState } from "react";
import AddData from '../../components/AddData/AddData'
import axios from "axios";
import { useParams } from "react-router-dom";
import EditData from "../../components/EditData/EditData";
import DeleteBtn from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/arrow_drop_down.svg";
import Modal from "../../components/Modal/Modal";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LoanPage = () => {
    const { id } = useParams();
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
   
    //Fetch Goals for the current account

    const fetchLoans = async () => {
        try {
          const loansResponse = await axios.get(`${SERVER_URL}/loans/${id}`)
          setLoans(loansResponse.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      };

       //Delete account for the current user
       const deleteLoan = async (loan_id) => {
        try{
            await axios.delete(`${SERVER_URL}/loans/${id}/${loan_id}`)
            fetchLoans();
        } catch (error) {
            console.error ('Error deleting transactions:', error);
        }
    }

    useEffect(() => {
      fetchLoans();
    }, [id]);

    const handleLoanDelete = (loan_id) => {
      deleteLoan(loan_id);
    }
  
    //Handle transaction click to edit it
    const handleLoanEdit = (loan) => {
      setSelectedLoan(loan);
      setIsModalOpen(true);
    }
  
    //Close the modal
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedLoan(null);
    }
  
    if (loading) {
        return <p>Loading Goals</p>
    }

    const loanFormFields = [
        {name: 'loan_type', label: 'Type of Loan', type: 'text'},
      {name: 'outstanding_balance', label: 'Outstanding Balance', type: 'number'},
      {name: 'interest_rate', label: 'Interest Rate', type: 'number'},
      {name: 'payment_schedule', label: 'Payment Schedule', type: 'text'}
    ];

    return ( 
        <>
        <div>
          <h2>Loan Information</h2>
          {loans ? (
            <>
            <ul>
            {loans.map((loan) => (
                <li key={loan.loan_id}>
                    <p>Loan: {loan.loan_type}</p>
                <p>Outstanding Balance: {loan.outstanding_balance}</p>
                <p>Interest Rate: {loan.interest_rate}</p>
                <p>Payment Schedule: {loan.payment_schedule}</p>
                <div onClick={() => {handleLoanDelete(loan.loan_id)}}>
                  <img src={DeleteBtn} alt="delete button" />Delete This Goal</div>
                <div onClick={() => {handleLoanEdit(loan)}}>
                  <img src={Edit} alt="edit button" />Edit this Goal</div>
                </li>
            ))}
            </ul>
            {/* Modal for Editing Transactions */}
        <Modal show={isModalOpen} onClose={closeModal}>
          {selectedLoan && (
            <EditData
              idType="id"
              idValue={selectedLoan.loan_id}
              formFields={loanFormFields}
              endpoint={`/loans/${id}`}
              initialData={selectedLoan}
              onDataUpdated={() => {
                fetchLoans();
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
            formFields={loanFormFields}
            endpoint="/loans/"
            onDataAdded={fetchLoans}
        />
        </div>
      </>
     );
}
 
export default LoanPage
