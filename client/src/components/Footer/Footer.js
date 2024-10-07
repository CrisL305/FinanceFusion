import { Link } from "react-router-dom";
import instagram from "../../assets/icons/Icon-instagram.svg";
import facebook from "../../assets/icons/Icon-facebook.svg";
import twitter from "../../assets/icons/Icon-twitter.svg";
import "./Footer.scss";
const Footer = () => {
    return ( 
        <footer className="footer pagePadding">
            <nav>
                <div>
                    <h2 className="footer--title font--title">Get in Touch</h2>
                    <div className="footer__holder">
                        <div className="footer--spacer">
                            <Link to="https://www.instagram.com"><img className="footer--icon" src={instagram} alt="instagram icon" /></Link>
                        </div>
                        <div className="footer--spacer">
                            <Link to="https://www.facebook.com"><img className="footer--icon" src={facebook} alt="facebook icon" /></Link>
                        </div>
                        <div>
                            <Link to="https://www.twitter.com"><img className="footer--icon" src={twitter} alt="twitter icon" /></Link>
                        </div>
                    </div>
                    <div className="footer--text font--normal">
                        <p>Copyright Finance Fusion © 2024 All Rights Reserved</p>
                    </div>
                </div>
            </nav>
        </footer>
     );
}
 
export default Footer;