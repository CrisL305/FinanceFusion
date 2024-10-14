import Close from "../../assets/icons/close.svg";
import "./Modal.scss";
const Modal = ({ show, onClose, children}) => {
    if(!show) {
        return null;
    }
    return (
        <>
            <div className="modal__overlay">
                <div className="modal__content">
                    <button className="modal__close" onClick={onClose}><img src={Close} /></button>
                    {children}
                </div>
            </div>
        </>
      );
}
 
export default Modal;