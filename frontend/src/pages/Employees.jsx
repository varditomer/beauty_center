import employeeImg from '../assets/images/woman.png';
import { useEffect, useState } from 'react';

export default function Employees({ BASE_URL }) {

    const [employees, setEmployees] = useState(null)

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const employees = await getEmployees();
                employees.forEach(employee => {
                    employee.treatmentTypes = employee.treatmentTypes.split(',')
                })
                console.log(`employees:`, employees)
                setEmployees(employees);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTreatments();
    }, []);

    const getEmployees = async () => {
        try {
            const response = await fetch(`${BASE_URL}/employee`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const employees = await response.json();
            return employees;
        } catch (error) {
            console.error(error);
            return [];
        }
    };


    return (
        <section className="employees-page">
            {employees &&
                employees.map(employee => {
                    return <article key={employee.id} className='employee-card'>
                        <div className="img-container">
                            <img src={employeeImg} alt="employee" className="img" />
                        </div>
                        <div className="details">
                            <div className="name detail"><span className="title">Name:</span> {employee.name.toUpperCase()}</div>
                            <div className="address detail"><span className="title">Address:</span> {employee.address}</div>
                            <div className="treatment detail"><span className="title">Treatments:</span> {employee.treatmentTypes.map(treatment => <span>*  {treatment}</span>)}</div>
                        </div>
                    </article>
                })
            }

        </section>
    )
}
