import axios from "axios";
import { forwardRef, useEffect, useState } from "react";
import "./EditData.scss";

const EditData = forwardRef(({ idType, idValue, endpoint, initialData, formFields, onDataUpdated }, ref) => {

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    const [formData, setFormData] = useState({...initialData});
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
        return new Date(dateString).toISOString().split('T')[0];
    }

    //Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value}));
        console.log(formData);
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
            console.log(dataToSubmit);

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
        <div className="editData__holder font--normal">
            <h3 className="editData__title font--title">Edit Data</h3>
            <form className="editData__form" ref={ref} onSubmit={handleSubmit}>
                {formFields.map((field) => (
                    <div className="editData__column" key={field.name}>
                        <label className="editData__label" htmlFor={field.name}>
                            {field.label}
                            </label>
                        {field.type === 'select' ? (
                            <select
                                className="editData__input"
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select {field.label}</option>
                                {field.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ): field.name === 'score_history' ? (
                            <textarea 
                                className="editData__input font--normal"
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                rows="5"
                                required
                            />
                        ): (
                            <input
                            className="editData__input font--normal"
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
                <div className="editData__holder">
                <button className="editData__button font--normal" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Data'}
                </button>
                </div>
            </form>
        </div>
        );
});

 
export default EditData;