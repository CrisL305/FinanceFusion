import { BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis, Bar, Legend } from "recharts";
import "./Graph.scss";

const getRandomColor = () => {
    const letters= `0123456789ABCDEF`;
    let color= '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
        
    }
    return color;
}

const Graph = ({ type, data, dataKey, xAxisKey, yAxisKey}) => {
    //Ensures the data is available to avoid rendering empty charts
    if(!data || data.length === 0){
        return <p>No data available for chart</p>;
    } 

    //Switch between different chart types based on props
    const renderChart = () => {
        switch (type) {
            case 'line':
                return(
                    <LineChart 
                        width={300} 
                        height={400} 
                        data={data} 
                        margin={{top: 40, left: -10, right: 10, bottom: 5}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey={xAxisKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
                    </LineChart>
                );
            case 'bar':
                return(
                    <BarChart 
                        width={400} 
                        height={300} 
                        data={data}
                        margin={{bottom: -5}}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xAxisKey} />
                        <YAxis />
                        <Bar dataKey={dataKey} fill="#2C3E50" />
                    </BarChart>
                );
            case 'pie':
                return (
                    <PieChart width={300} height={300}>
                        <Pie
                            data={data}
                            dataKey={dataKey}
                            nameKey={xAxisKey}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getRandomColor()} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                );
                default:
                    return <p>Invalid chart type</p>
        }
    };
    return ( 
        <div className="graph__container">
            {renderChart()} 
        </div>
     );
}
 
export default Graph;