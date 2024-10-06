import "./Header.scss";
import logo from '../../assets/logo/FFLogo.svg';
import { Link } from "react-router-dom";

const Header = () => {
    return ( 
        <>
            <div>
                <Link to="/"><img className="logo" src={logo} alt="logo of website" /></Link>
                This is the header.
            </div>
        </>
     );
}
 
export default Header;