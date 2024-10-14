import { useEffect, useState } from "react";
import AddData from '../../components/AddData/AddData'
import axios from "axios";
import { useParams } from "react-router-dom";
import DeleteBtn from '../../assets/icons/delete.svg';
import Modal from "../../components/Modal/Modal";
import EditData from "../../components/EditData/EditData";
import Edit from '../../assets/icons/arrow_drop_down.svg';


const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const TransactionPage = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Fetch transactions for the current account
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/transactions/account/${id}`)
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  //Delete transaction for the current account
  const deleteTransactions = async (transaction_id) =>{
    try{
      await axios.delete(`${SERVER_URL}/transactions/account/${id}/${transaction_id}`)
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transactions:', error);
    }
  }
  useEffect(() => {
    fetchTransactions();
  }, [id]);

  const handleTransactionClick = (transactionId) => {
    deleteTransactions(transactionId);
  }

  //Handle transadction click to edit it
  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  }

  //Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  }

  const formFields = [
    {name: 'amount', label: 'Amount', type: 'number'},
    {name: 'transaction_type', label: 'Transaction_type', type: 'text'},
    {name: 'category', label: 'Category', type: 'text'},
    {name: 'description', label: 'Description', type: 'text'},
    {name: 'date', label: 'Date', type: 'date'}
  ];

    return (
        <>
          <div>
            <h2>Account Transactions</h2>
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.transaction_id}>
                    {transaction.category}: ${transaction.amount} - {transaction.description} 
                    (Date: {new Date(transaction.date).toLocaleDateString()})
                    <div onClick={() => {handleTransactionClick(transaction.transaction_id)}}>
                      <img src={DeleteBtn} alt="delete button" />Delete This Transaction</div>
                    <div onClick={() => {handleEditClick(transaction)}}>
                      <img src={Edit} alt="edit button" />Edit this transaction</div>
                </li>
              ))}
            </ul>

            {/* Modal for Editing Transactions */}
            <Modal show={isModalOpen} onClose={closeModal}>
              {selectedTransaction && (
                <EditData
                  idType="transaction_id"
                  idValue={selectedTransaction.transaction_id}
                  formFields={formFields}
                  endpoint={`/transactions/account/${id}`}
                  initialData={selectedTransaction}
                  onDataUpdated={() => {
                    fetchTransactions();
                    closeModal();
                  }}
                />
              )}
            </Modal>

            <AddData
              idType="account_id"
              idValue={id}
              formFields={formFields}
              endpoint="/transactions/account/"
              onDataAdded={fetchTransactions}
            />
          </div>
        </>
      );
}
 
export default TransactionPage;