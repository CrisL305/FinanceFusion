import { useState } from "react";
import DownArrow from "../../assets/icons/arrow_drop_down.svg";
import Chevron from "../../assets/icons/chevron.svg";
import "./CollapsibleAccount.scss";
import GetLastTransaction from "../../components/GetLastTransaction/GetLastTransaction";


const CollapsibleAccount = ({ account, transactions }) => {
    const [isOpen, setIsOpen] = useState(false);

    return ( 
        <div className="collapsibleAccount">
            <div className="account__header" onClick={() => setIsOpen(!isOpen)}>
                <h3>{account.bank_name}
                    <span className="account__icon">
                        {isOpen ? (
                            <img className="collapsibleAccount__icon" src={DownArrow} alt="arrow down icon"/>
                            ) : (
                            <img className="collapsibleAccount__icon" src={Chevron} alt="arrow icon"/>
                            )}
                        </span>
                    </h3>
            </div>
            {isOpen && (
                <div className="account__details">
                    <p>Balance: ${account.balance}</p>
                    <p><GetLastTransaction 
                            account_id={account.account_id} 
                            transactions={transactions} 
                        />
                    </p>
                </div>
            )}
        </div>
     );
}
 
export default CollapsibleAccount;