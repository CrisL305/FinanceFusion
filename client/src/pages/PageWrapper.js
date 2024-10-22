import { Route, Routes, useLocation, useParams } from "react-router-dom";
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
import BottomNavBar from "../components/BottomNavBar/BottomNavBar";
import { useContext } from "react";
import { UserContext, UserProvider } from "../context/UserContext";


const PageWrapper = () => {
    const location = useLocation();
    const { id } = useContext(UserContext); 

    //Defines the pages where the bottom navigation should appear
    const showNavBar = [
        "/accounts", 
        "/transactions", 
        "/goals", 
        "/budgets", 
        "/loans", 
        "/creditscores"
    ].some((path) => location.pathname.startsWith(path));

    console.log(showNavBar);
    console.log(location.pathname);

    return (  
        <>
        <Header />
        <UserProvider>
        <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/profile" element={<ProfilePage />}/>
            <Route path="/profile/users/:id" element={<UserPageDetailed />}/>
            <Route path="/accounts/:id" element={<AccountDetailsPage />}/>
            <Route path="/creditscores/:id" element={<CreditScorePage/>}/>
            <Route path="/goals/:id" element={<GoalsPage/>}/>
            <Route path="/budgets/:id" element={<BudgetPage/>}/>
            <Route path="/loans/:id" element={<LoanPage/>}/>
            <Route path="/transactions/:id" element={<TransactionPage/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
        
        {/* Conditionally render the BottomNavBar */}
        {showNavBar && <BottomNavBar id={id} />}
        </UserProvider>
        <Footer/>
        </>
    );
}
 
export default PageWrapper;