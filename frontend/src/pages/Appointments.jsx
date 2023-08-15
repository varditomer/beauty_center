import { useEffect, useState } from 'react';
import AppointmentTable from '../components/AppointmentTable';
import { Link } from 'react-router-dom';

export default function Appointments({ BASE_URL, loggedInUser }) {
    // State to hold appointments
    const [appointments, setAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState(null);

    useEffect(() => {
        // Fetch and sort user appointments when component mounts
        const getAppointments = async () => {
            try {
                // Fetch user appointments
                const isEmployee = loggedInUser.isEmployee
                const appointments = isEmployee ? await fetchEmployeeAppointments() : await fetchCustomerAppointments();
                const canceledAppointments = isEmployee ? await fetchEmployeeCanceledAppointments() : null
                setCanceledAppointments(canceledAppointments)
                // Sort appointments by appointmentDateTime
                appointments.sort((a, b) => {
                    const dateA = new Date(a.appointmentDateTime);
                    const dateB = new Date(b.appointmentDateTime);
                    return dateA - dateB;
                });
                // Update state with sorted appointments
                setAppointments(appointments);
            } catch (error) {
                console.error(error);
            }
        };

        getAppointments();
    }, []);

    // Function to fetch customer's appointments
    const fetchCustomerAppointments = async () => {
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

    // Function to fetch employee's appointments
    const fetchEmployeeAppointments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/employee/${loggedInUser.id}`, {
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

    const fetchEmployeeCanceledAppointments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/canceledAppointments/${loggedInUser.id}`, {
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
            {/* Display page title */}
            <h1 className="page-title">{loggedInUser.isEmployee ? `Employee's ` : `Customer's `}Appointments</h1>

            {/* Link to add appointment page */}
            {!(loggedInUser.isEmployee) && <Link to='/addAppointment'>
                <button className="add-appointment-btn">Add Appointment</button>
            </Link>}

            <div className="appointment-section">
                {/* Display AppointmentTable component if appointments are available */}
                {!!appointments.length &&
                    <AppointmentTable setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={appointments} loggedInUser={loggedInUser} />
                }
            </div>
            <div className="appointment-section">
                {/* Display AppointmentTable component if appointments are available */}
                {!!loggedInUser.isEmployee && canceledAppointments &&
                    <>
                        <h1 className="page-title" style={{ marginBottom: "20px" }}>Canceled Appointments</h1>
                        <AppointmentTable isCanceledAppointment={true} setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={canceledAppointments} loggedInUser={loggedInUser} />
                    </>
                }
            </div>
        </section>
    );
}
