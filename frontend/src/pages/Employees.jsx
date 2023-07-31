import employeeImg from '../assets/images/employee1.png';
import { useEffect, useState } from 'react';

export default function Employees({BASE_URL}) {

    const [employees, setEmployees] = useState(null)

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const employees = await getEmployees();
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
            <div className="image-section">
                <div className="image-container">
                    <img src={employeeImg} alt="employee" />
                    <p className="caption">adel Jon... She works in manicure,
                        <span className="text-highlight">pedicure</span> ,<span className="text-highlight">massage</span>, and <span className="text-highlight">makeup</span>.
                    </p>
                </div>
                <div className="image-container">
                    <img src={employeeImg} alt="employee" />
                    <p>Teeny skyshe works in
                        <span className="text-highlight">
                            facial treatment </span>,
                        <span className="text-highlight">makeup</span>
                        ,and in
                        <span className="text-highlight">eyebrows
                        </span>
                        ,<span className="text-highlight">laser treatment
                        </span>
                    </p>
                </div>
                <div className="image-container">
                    <img src={employeeImg} alt="employee" />
                    <p>Paragraph 3</p>
                </div>
            </div>
        </section>
    )
}
