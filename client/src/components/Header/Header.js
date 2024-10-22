import "./Header.scss";
import logo from '../../assets/logo/FFLogo.svg';
import { Link, NavLink } from "react-router-dom";


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
                <div className="header__holder">
                <nav className="header--btn font--title">
                    <NavLink 
                        className={(navData) => 
                            navData.isActive
                            ? 'header__link header__customBtn header__link--active'
                            : 'header__link header__customBtn'
                        }
                        to="/"
                        exact="true"
                    >Home</NavLink>
                </nav>
                <nav className="header--btn font--title header--btn--bottom">
                <NavLink
                    className={(navData) =>
                        navData.isActive
                        ? 'header__link header__customBtn header__link--active'
                        : 'header__link header__customBtn'
                    }
                    to="/profile"
                    exact="true"
                    >
                        Profile
                    </NavLink>
                </nav>
                </div>
               
            </div>
        </>    
     );
}
 
export default Header;