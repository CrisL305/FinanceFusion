import "./Header.scss";
import logo from '../../assets/logo/FFLogo.svg';
import { Link } from "react-router-dom";
import Btn from "../Btn/Btn";

const Header = () => {
    return (
        <>
            <div className="header pagePadding">
                <div className="header__holder--logo">
                <Link className=" font--logo header__link" to="/">
                    <img className="header__logo" src={logo} alt="logo of website" />
                        <div className="header__logo--name">
                            Finance Fusion
                        </div>
                </Link>
                </div>
                <div className="header--btn">
                <Btn content={"Login"}/>
                <Btn content={"Logout"}/>
                </div>
                
            </div>
        </>    
     );
}
 
export default Header;