const GetLastTransaction = ({account_id, transactions}) => {
    const accountTransactions = transactions.filter(
        (tx) => tx.account_id === account_id
    );
    const lastTransaction = accountTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    )[0];

    return lastTransaction
    ? `${lastTransaction.category}: $${lastTransaction.amount}`
    : "No recent transactions";
};
 
export default GetLastTransaction;