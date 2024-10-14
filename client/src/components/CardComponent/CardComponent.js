import { useNavigate } from "react-router-dom";
import './CardComponent.scss';

const UserCard = ({ id, content, linkPath }) => {
    const navigate = useNavigate();

    //Handler for clicking the card
    const handleClick = () => {
      navigate(`${linkPath}/${id}`); //Dynamic id for URL
    };

    return(
      <div className="card" onClick={handleClick}>
        <h3>{content}</h3>
        <p>Click to vew details</p>
      </div>
    )
}

export default UserCard;