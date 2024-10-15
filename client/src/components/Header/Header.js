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
                <nav className="">
                    <NavLink 
                        className={(navData) => 
                            navData.isActive
                            ? 'header__link header__link--active'
                            : 'header__link'
                        }
                        to="/"
                        exact="true"
                    >Home</NavLink>
                </nav>
                <NavLink
                    className={(navData) =>
                        navData.isActive
                        ? 'header__link header__link--active'
                        : 'header__link'
                    }
                    to="/profile"
                    exact="true"
                    >
                        Profile
                    </NavLink>
            </div>
        </>    
     );
}
 
export default Header;