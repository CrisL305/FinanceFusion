import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const AccountDetailsPage = () => {
    const { id} = useParams();
    const [accounts, setAccounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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
        fetchAccountDetails();
    }, [id]);

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
                <ul>
                {accounts.map((account) => (
                    <li key={account.account_id}>
                        <p>Bank: {account.bank_name}</p>
                    <p>Account Type: {account.account_type}</p>
                    <p>Balance: ${account.balance}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p>No account found.</p>
            )}
        </div>
     );
}
 
export default AccountDetailsPage;