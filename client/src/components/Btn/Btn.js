import "./Btn.scss";
const Btn = ( {content} ) => {
    return ( 
        <>
        <button className="btnStyle">
        {content}
        </button>
        </>
     );
}
 
export default Btn;