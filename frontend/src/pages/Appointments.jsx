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
                // const tableData = appointments.map(appointment => {
                //     const appointmentDateTime = appointment.appointmentDateTime.substring(0, 10)
                    
                //     return { ...appointment, appointmentDateTime: appointmentDateTime }
                // })
                // setTableData(tableData)
                console.log('userAppointments:', appointments);
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
            <Link to='/addAppointment'>
                <button className="add-appointment-btn">Add appointment</button>
            </Link>
            <div className="appointment-section">
                {appointments &&
                    <AppointmentTable setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={appointments} />
                }
            </div>
        </section>
    )
}
