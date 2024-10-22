import { Link } from "react-router-dom";
import "./BottomNavBar.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";

const BottomNavBar = () => {
    const [isAtFooter, setIsAtFooter] = useState(false);
    const footerRef = useRef(null);

    const { id } = useContext(UserContext);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsAtFooter(entry.isIntersecting);
            },
            { threshold: 0.1}
        );

        const footer = document.getElementById("footer");
        if (footer) observer.observe(footer);

        return () => {
            if (footer) observer.unobserve(footer);
        };
    }, []);
    return ( 
        <nav className={`bottomNav ${isAtFooter ? "stopAtFooter" : ""}`}>
            <ul className="bottomNav__list">
                <li><Link className="bottomNav__item" to={`/accounts/${id}`}>Accounts</Link></li>
                <li><Link className="bottomNav__item" to={`/transactions/${id}`}>Transactions</Link></li>
                <li><Link className="bottomNav__item" to={`/goals/${id}`}>Goals</Link></li>
                <li><Link className="bottomNav__item" to={`/budgets/${id}`}>Budgets</Link></li>
                <li><Link className="bottomNav__item" to={`/loans/${id}`}>Loans</Link></li>
                <li><Link className="bottomNav__item" to={`/creditscores/${id}`}>Credit Scores</Link></li>
            </ul>
        </nav>
     );
}
 
export default BottomNavBar;