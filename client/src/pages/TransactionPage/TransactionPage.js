import { useContext, useEffect, useState } from "react";
import AddData from '../../components/AddData/AddData'
import axios from "axios";
import { useParams } from "react-router-dom";
import DeleteBtn from '../../assets/icons/delete.svg';
import Modal from "../../components/Modal/Modal";
import EditData from "../../components/EditData/EditData";
import Edit from '../../assets/icons/arrow_drop_down.svg';
import Graph from "../../components/Graph/Graph";
import { UserContext } from "../../context/UserContext";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const transactionFormFields = (accounts) => [
  {
    name: "account_id",
    label: "Account",
    type: "select",
    options: accounts.map((account) => ({
      value: account.account_id,
      label: `${account.bank_name} (${account.account_type})`,
    })),
  },
  {name: 'amount', label: 'Amount', type: 'number'},
  {name: 'transaction_type', label: 'Transaction Type', type: 'text'},
  {name: 'category', label: 'Category', type: 'text'},
  {name: 'description', label: 'Description', type: 'text'},
  {name: 'date', label: 'Date', type: 'date'}
];

const TransactionPage = () => {
  const { id } = useParams();
  const { setId } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Fetch transactions for the current account
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/transactions/${id}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

    //Fetch accounts for the dropdown
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/accounts/${id}`);
        setAccounts(response.data);
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
    setId(id);
    fetchTransactions();
    fetchAccounts();
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

  //Data Transaction Transformation for Graph
  const transformTransactionData = (transactions) =>  {
    const groupedData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('en-US');
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += Number(transaction.amount);
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, total]) => ({
      date,
      total,
    }));
  };

  const transformedData = transformTransactionData(transactions).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <>
          <div className="pageDefault__holder">
            <h2 className="headerDefault font--title">Account Transactions</h2>
            <Graph
            type="line"
            data={transformedData}
            dataKey="total"
            xAxisKey="date"
          />
            <ul className="pagePadding font--normal pageDefault__listHolder">
              {transactions
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((transaction) => (
                <li className="pageDefault__list" key={transaction.transaction_id}>
                    {transaction.category}: ${transaction.amount} - {transaction.description} 
                    (Date: {new Date(transaction.date).toLocaleDateString()})
                    <div className="details__delete" onClick={() => {handleTransactionClick(transaction.transaction_id)}}>
                      <img className="details__icon" src={DeleteBtn} alt="delete button" />Delete This Transaction</div>
                    <div className="details__edit" onClick={() => {handleEditClick(transaction)}}>
                      <img className="details__icon" src={Edit} alt="edit button" />Edit this transaction</div>
                </li>
              ))}
            </ul>

            {/* Modal for Editing Transactions */}
            <Modal show={isModalOpen} onClose={closeModal}>
              {selectedTransaction && (
                <EditData
                  idType="transaction_id"
                  idValue={selectedTransaction.transaction_id}
                  formFields={transactionFormFields(accounts)}
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
              formFields={transactionFormFields(accounts)}
              endpoint="/transactions/account/"
              onDataAdded={fetchTransactions}
            />
          </div>
        </>
      );
}
 
export default TransactionPage;