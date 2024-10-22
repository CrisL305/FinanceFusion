import axios from "axios";
import { useState } from "react";
import "./AddData.scss";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const AddData = ({ contentName, formFields, endpoint, idType, idValue, onDataAdded }) => {
    const initialFormState = formFields.reduce((state, field) => {
        state[field.name] = '';
        return state;
    }, {});
    
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    //Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    //Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSubmit = {
                //Dynamically sets either user_id or account_id
                [idType]: idValue,
                ...formData
            };
        
            //Send POST request to the provided endpoint
            const response = await axios.post(`${SERVER_URL}${endpoint}${idValue}`, dataToSubmit);
            
            if (response.status === 201) {
                alert('Data added successfully!');
                onDataAdded();
                setFormData(initialFormState);
            }
            } catch (error) {
                console.error('Error adding data:', error);
                setError('Failed to add data. Please try again.');
            }
            
            setLoading(false);
        };
    return ( 
        <>
            <div className="addData__holder pagePadding font--normal">
                <div className="addData">
                <h3 className="font--title">Add New {contentName}</h3>
                <form onSubmit={handleSubmit}>
                    {formFields.map((field) => (
                        <div key={field.name}>
                            <label className="addData__label" htmlFor={field.name}>{field.label}</label>
                            <input
                                className="addData__input"
                                type={field.type || 'text'}
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="addData__holder">
                    <button className="addData__button font--normal" type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Data'}
                    </button>
                    </div>
                </form>
                </div>
            </div>
        </>
     );
};
 
export default AddData;