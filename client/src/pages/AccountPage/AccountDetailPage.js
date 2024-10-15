import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeleteBtn from '../../assets/icons/delete.svg';
import Edit from '../../assets/icons/arrow_drop_down.svg';
import AddData from "../../components/AddData/AddData";
import Modal from "../../components/Modal/Modal";
import EditData from "../../components/EditData/EditData";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const AccountDetailsPage = () => {
    const { id} = useParams();
    const [accounts, setAccounts] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

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

    return ( 
        <div>
            <h2>Account Details</h2>
            {accounts ? (
                <>
                <ul>
                {accounts.map((account) => (
                    <li key={account.account_id}>
                        <p>Bank: {account.bank_name}</p>
                    <p>Account Type: {account.account_type}</p>
                    <p>Balance: ${account.balance}</p>
                    <div onClick={() => {handleAccountClick(account.account_id)}}>
                      <img src={DeleteBtn} alt="delete button" />Delete This Account</div>
                    <div onClick={() => {handleEditClick(account)}}>
                      <img src={Edit} alt="edit button" />Edit this Account</div>
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