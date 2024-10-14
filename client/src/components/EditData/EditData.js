import axios from "axios";
import { forwardRef, useEffect, useState } from "react";

const EditData = forwardRef(({ idType, idValue, endpoint, initialData, onDataUpdated }, ref) => {

    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    const [formData, setFormData] = useState({
        ...initialData,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    //Helper function to format date to "yyyy-MM-dd"
    const formatDate = (dateString) => {
        const date = new Date(dateString).toISOString().split('T')[0];
        console.log(date);
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
                account_id: formData.account_id,
                ...formData,
            };

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

    const formDataFields = [
        {
            title: "Amount",
            name: "amount",
            type: "number",
            value: formData.amount,
        },
        {
            title: "Transaction Name",
            name: "transaction_type",
            type: "text",
            value: formData.transaction_type,
        },
        {
            title: "Category",
            name: "category",
            type: "text",
            value: formData.category,
        },
        {
            title: "Description",
            name: "description",
            type: "text",
            value: formData.description,
        },
        {
            title: "Date",
            name: "date",
            type: "date",
            value: formData.date ? formatDate(formData.date) : "",
        }
    ];

    return ( 
        <div>
            <h3>Edit Data</h3>
            <form ref={ref} onSubmit={handleSubmit}>
                {formDataFields.map((field)=>(
                    <div key={field.name}>
                        <label htmlFor={field.name}>{field.name}</label>
                        <input
                            type={field.type || 'text'}
                            id={field.name}
                            name={field.name}
                            value={field.value || ''}
                            onChange={handleChange}
                            required
                        />
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