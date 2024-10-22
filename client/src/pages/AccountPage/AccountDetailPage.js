import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteBtn from '../../assets/icons/delete.svg';
import Edit from '../../assets/icons/arrow_drop_down.svg';
import AddData from "../../components/AddData/AddData";
import Modal from "../../components/Modal/Modal";
import EditData from "../../components/EditData/EditData";
import CollapsibleAccount from "../../components/CollapsibleAccount/CollapsibleAccount";
import "./AccountDetailPage.scss";
import Graph from "../../components/Graph/Graph";
import { UserContext } from "../../context/UserContext";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const AccountDetailsPage = () => {
    const { id} = useParams();
    const { setId } = useContext(UserContext);
    const [accounts, setAccounts] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [transactions, setTransactions] = useState(null);
    const [filter, setFilter] = useState("");

    const transformAccountData = (accounts) => {
        return accounts.map((account) => ({
            name: account.bank_name,
            value: Number(account.balance) || 0,
        }));
    };

    useEffect(()=> {
        setId(id);
        const fetchUserData = async () => {
            try{
    //fetch user transactions
    const transactionsResponse = await axios.get(`${SERVER_URL}/transactions/account/${id}`);
    setTransactions(transactionsResponse.data);
        } catch (error) {
            console.log(error)
        }
        } ;
        fetchUserData();
    }, [id]);
    //Fields for editing an account
    const accountFormFields = [
        {name: 'bank_name', label: 'Bank Name', type: 'text'},
        {name: 'account_type', label: 'Account Type', type: 'text'},
        {name: 'balance', label: 'Balance', type: 'number'}
    ];

    const fetchAccountDetails = async () => {
        try{
            const response = await axios.get(`${SERVER_URL}/accounts/${id}`);
            setAccounts(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching account details');
            setLoading(false);
        }
    }

    //Delete account for the current user
    const deleteAccount = async (account_id) => {
        try{
            await axios.delete(`${SERVER_URL}/accounts/${id}/${account_id}`)
            fetchAccountDetails();
        } catch (error) {
            console.error ('Error deleting transactions:', error);
        }
    }

    useEffect(() => {
        fetchAccountDetails();
    }, [id]);

    const handleAccountClick = (accountId) => {
        deleteAccount(accountId);
      }
    
      //Handle transaction click to edit it
      const handleEditClick = (account) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
      }
    
      //Close the modal
      const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAccount(null);
      }

    if (loading) {
        return <p>Loading account details...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    const pieChartData = transformAccountData(accounts).filter((account) => account.value >= 0);

    const filteredAccounts = filter
        ? accounts.filter((account) => account.account_type === filter)
        : accounts;

    return ( 
        <div>
            <h2 className="headerDefault font--title">Account Details</h2>
            <div>
                    <Graph
                        type="pie"
                        data={pieChartData}
                        dataKey="value"
                        colors={['#2C3E50', '#F39C12', 'Blue']}
                    />
                </div>
            {accounts ? (
                <>
                <div className="filter__holder">
                <div>
                    <select className="filter__input font--normal" onChange={(e) => setFilter(e.target.value)}>
                        <option className="filter__select" value="">All Accounts</option>
                        <option className="filter__select" value="Savings">Savings</option>
                        <option className="filter__select" value="Checking">Checking</option>
                        <option className="filter__select" value="Credit Card">Credit</option>
                    </select>
                </div>
                </div>
                <ul>
                {filteredAccounts.map((account) => (
                    <li className="accountDetails__holder" key={account.account_id}>
                        <CollapsibleAccount account={account} transactions={transactions} />
                        <div className="details__delete" onClick={() => {handleAccountClick(account.account_id)}}>
                      <img className="details__icon" src={DeleteBtn} alt="delete button" />Delete This Account</div>
                    <div className="details__edit" onClick={() => {handleEditClick(account)}}>
                      <img className="details__icon" src={Edit} alt="edit button" />Edit this Account</div>
                    </li>
                ))}
                </ul>
                {/* Modal for Editing Transactions */}
            <Modal show={isModalOpen} onClose={closeModal}>
              {selectedAccount && (
                <EditData
                  idType="id"
                  idValue={selectedAccount.account_id}
                  formFields={accountFormFields}
                  endpoint={`/accounts/${id}`}
                  initialData={selectedAccount}
                  onDataUpdated={() => {
                    fetchAccountDetails();
                    closeModal();
                  }}
                />
                
              )}
            </Modal>

            <AddData
                idType="id"
                idValue={id}
                formFields={accountFormFields}
                endpoint="/accounts/"
                onDataAdded={fetchAccountDetails}
            />
                </>
            ) : (
                <p>No account found.</p>
            )}
        </div>
     );
}
 
export default AccountDetailsPage;