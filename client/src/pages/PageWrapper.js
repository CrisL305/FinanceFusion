import { Route, Routes } from "react-router-dom";
import Header from "../components/Header/Header";
import HomePage from "./HomePage/HomePage";
import LoanPage from "./LoanPage/LoanPage";
import NotFound from "./NotFound/NotFound";
import TransactionPage from "./TransactionPage/TransactionPage";
import Footer from "../components/Footer/Footer";
import ProfilePage from "./ProfilePage/ProfilePage";
import GoalsPage from "./GoalsPage/GoalsPage";
import BudgetPage from "./BudgetPage/BudgetPage";
import CreditScorePage from "./CreditScoresPage/CreditScoresPage";
import AccountDetailsPage from "./AccountPage/AccountDetailPage";
import UserPageDetailed from "./UserPage/UserPageDetailed";

const PageWrapper = () => {
    return (  
        <>
        <Header />
        <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/profile" element={<ProfilePage />}/>
            <Route path="/profile/users/:id" element={<UserPageDetailed />}/>
            <Route path="/accounts/:id" element={<AccountDetailsPage />}/>
            <Route path="/creditScore" element={<CreditScorePage/>}/>
            <Route path="/goals/:id" element={<GoalsPage/>}/>
            <Route path="/budgets" element={<BudgetPage/>}/>
            <Route path="/loans" element={<LoanPage/>}/>
            <Route path="/transactions/:id" element={<TransactionPage/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
        <Footer/>
        </>
    );
}
 
export default PageWrapper;