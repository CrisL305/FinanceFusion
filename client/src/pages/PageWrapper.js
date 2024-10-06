import { Route, Routes } from "react-router-dom";
import Header from "../components/Header/Header";
import HomePage from "./HomePage/HomePage";
import UserPage from "./UserPage/UserPage";
import AccountPage from "./AccountPage/AccountPage";
import CreditScorePage from "./CreditScoresPage/CreditScoresPage";
import GoalsAndBudgetsPage from "./GoalAndBudgetPage/GoalsAndBudgetsPage";
import LoanPage from "./LoanPage/LoanPage";
import NotFound from "./NotFound/NotFound";
import TransactionPage from "./TransactionPage/TransactionPage";
import Footer from "../components/Footer/Footer";

const PageWrapper = () => {
    return (  
        <>
        <Header />
        <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/users" element={<UserPage />}/>
            <Route path="/accounts" element={<AccountPage />}/>
            <Route path="/creditScore" element={<CreditScorePage/>}/>
            <Route path="/goalsandbudgets" element={<GoalsAndBudgetsPage/>}/>
            <Route path="/loans" element={<LoanPage/>}/>
            <Route path="transaction" element={<TransactionPage/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
        <Footer/>
        </>
    );
}
 
export default PageWrapper;