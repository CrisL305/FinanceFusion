import axios from "axios";
import { forwardRef, useEffect, useState } from "react";

const EditData = forwardRef(({ idType, idValue, endpoint, initialData, formFields, onDataUpdated }, ref) => {

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    const [formData, setFormData] = useState({
        ...initialData,
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            const formattedData = { ...initialData };
            if (formattedData.score_history) {
                formattedData.score_history = JSON.stringify(formattedData.score_history, null, 2);
            }

            formFields.forEach(field => {
                if (field.type === 'date' && formattedData[field.name]) {
                    formattedData[field.name] = formatDate(formattedData[field.name]);
                }
            });

            setFormData(formattedData);
        }
    }, [initialData, formFields])

    //Helper function to format date to "yyyy-MM-dd"
    const formatDate = (dateString) => {
        const date = new Date(dateString).toISOString().split('T')[0];
        return date
    }

    //Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    //Handle for submission for editing the data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try{

            const dataToSubmit = {
                [idType]: idValue,
                ...formData
            };

            formFields.forEach((field) => {
                if (field.name === 'score_history' && formData[field.name]) {
                    dataToSubmit[field.name] = JSON.parse(formData[field.name]);
                }
            })

            const response = await axios.put(`${SERVER_URL}${endpoint}/${idValue}`, dataToSubmit);

            if (response.status === 200) {
                alert('Data updated successfully!');
                onDataUpdated();
            }
        } catch (error) {
            console.error(error);
            setError('Failed to update data. Please try again.');
        }

        setLoading(false);
    };

    return ( 
        <div>
            <h3>Edit Data</h3>
            <form ref={ref} onSubmit={handleSubmit}>
                {formFields.map((field)=>(
                    <div key={field.name}>
                        <label htmlFor={field.name}>{field.label}</label>
                        {field.name === 'score_history' ? (
                            <textarea
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                rows="5"
                                required
                            />
                        ): (
                            <input
                            type={field.type || 'text'}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required
                        />
                        )}
                    </div>
                ))}

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Data'}
                </button>
            </form>
        </div>
        );
});

 
export default EditData;