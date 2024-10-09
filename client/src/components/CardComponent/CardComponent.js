//Card component for user selection
const UserCard = ({ userId, name, onClick }) => (
    <div className='user-card' onClick={() => onClick(userId)}>
      <h3>{name}</h3>
      <p>Select this user</p>
    </div>
  );

export default UserCard;