import { useEffect, useState } from 'react'
import AppointmentTable from '../components/AppointmentTable';
import { Link } from 'react-router-dom';

export default function Appointments({ BASE_URL, loggedInUser }) {
    const [appointments, setAppointments] = useState(null)
    const [tableData, setTableData] = useState(null)




    useEffect(() => {
        const fetchUserAppointments = async () => {
            try {
                const appointments = await getUserAppointments();
                setAppointments(appointments);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserAppointments();
    }, []);



    const getUserAppointments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const appointments = await response.json();
            return appointments;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    return (
        <section className="appointment-page">
            <h1 className="page-title">{loggedInUser.isEmployee ? `Employee's ` : `Customer's `}Appointments</h1>

            <Link to='/addAppointment'>
                <button className="add-appointment-btn">Add Appointment</button>
            </Link>
            <div className="appointment-section">
                {appointments &&
                    <AppointmentTable setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={appointments} loggedInUser={loggedInUser} />
                }
            </div>
        </section>
    )
}
