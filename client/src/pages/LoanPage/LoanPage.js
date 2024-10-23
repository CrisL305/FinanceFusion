import { useContext, useEffect, useState } from "react";
import AddData from '../../components/AddData/AddData'
import axios from "axios";
import { useParams } from "react-router-dom";
import EditData from "../../components/EditData/EditData";
import DeleteBtn from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/arrow_drop_down.svg";
import Modal from "../../components/Modal/Modal";
import Chevron from "../../assets/icons/chevron.svg";
import "./LoanPage.scss";
import { UserContext } from "../../context/UserContext";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LoanPage = () => {
    const { id } = useParams();
    const { setId } = useContext(UserContext);
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedLoan, setExpandedLoan] = useState(null);
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

    const calculateAmortization = (loanAmount, interestRate, loanTerm) => {
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      const monthlyPayment = (
        loanAmount * monthlyRate /
        (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
      ).toFixed(2);

      let schedule = [];
      let balance = loanAmount;

      for (let i = 1; i < numberOfPayments; i++) {
        const interestPayment = (balance * monthlyRate).toFixed(2);
        const principalPayment = (monthlyPayment - interestPayment).toFixed(2);
        balance = (balance - principalPayment).toFixed(2);

        schedule.push({
          month: i,
          monthlyPayment: parseFloat(monthlyPayment),
          principalPayment: parseFloat(principalPayment),
          interestPayment: parseFloat(interestPayment),
          remainingBalance: parseFloat(balance),
        });
      }
      
      return schedule;
    };

    useEffect(() => {
      fetchLoans();
      setId(id);
    }, [id]);

    const toggleLoan = (loan_id) => {
      setExpandedLoan((prev) => (prev === loan_id ? null : loan_id));
    };

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
        <div className="pageDefault__holder">
          <h2 className="headerDefault font--title">Loan Information</h2>
          {loans ? (
            <>
            <ul className="pagePadding font--normal pageDefault__listHolder">
            {loans.map((loan) => {
              const schedule = calculateAmortization(
                loan.outstanding_balance,
                loan.interest_rate,
                4
              );

              const isExpanded = expandedLoan === loan.loan_id;

              return (
                <li className="pageDefault__list" key={loan.loan_id}>
                    <p>Loan: {loan.loan_type}</p>
                <p>Outstanding Balance: {loan.outstanding_balance}</p>
                <p>Interest Rate: {loan.interest_rate}</p>
                <p>Payment Schedule: {loan.payment_schedule}</p>
                <div onClick={() => toggleLoan(loan.loan_id)}>
                  <h5>Loan Amortization Schedule</h5>
                  <img 
                    src={isExpanded ? Edit : Chevron}
                    alt="Toggle Icon"
                  />
                </div>
                {isExpanded && (
                                  <table className="schedule">
                                  <thead>
                                    <tr>
                                      <th>Month</th>
                                      <th>Monthly Payment</th>
                                      <th>Principal</th>
                                      <th>Interest</th>
                                      <th>Remaining Balance</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {schedule.map((payment) => (
                                      <tr key={payment.month}>
                                        <td>{payment.month}</td>
                                        <td>${payment.monthlyPayment}</td>
                                        <td>${payment.principalPayment}</td>
                                        <td>${payment.interestPayment}</td>
                                        <td>${payment.remainingBalance}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                )
              }
                <div className="details__delete" onClick={() => {handleLoanDelete(loan.loan_id)}}>
                  <img className="details__icon" src={DeleteBtn} alt="delete button" />Delete This Goal</div>
                <div className="details__edit" onClick={() => {handleLoanEdit(loan)}}>
                  <img className="details__icon" src={Edit} alt="edit button" />Edit this Goal</div>
                </li>
            )})}
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
