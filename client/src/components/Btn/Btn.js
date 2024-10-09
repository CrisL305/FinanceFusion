import "./Btn.scss";
const Btn = ( {content, login, logout} ) => {

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;

        if (login === true && logout === false) {
            return (
                <a className="btnStyle" href={`${SERVER_URL}/auth/github`}>
            <span className="">{content}</span>
        </a>
            )
        }

        if (login === false && logout === true) {
            return(
                <>
 {/* The link will take user to `http://localhost:5050/auth/logout` which will delete the user server session and redirect user back to client-side app with the cookie invalidated*/}
 <a className="btnStyle" href={`${SERVER_URL}/auth/logout`}>
 <span className="">{content}</span>
</a>
</>
            )
        }
        if (login === false && logout === false) {
            return(
                <button className="btnStyle">
            {content}
            </button>
            )
        }
}
 
export default Btn;