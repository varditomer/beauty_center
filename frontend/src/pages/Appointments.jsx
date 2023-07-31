import { useEffect, useState } from 'react'
import Table from '../components/Table';

export default function Appointments({ BASE_URL, loggedInUser }) {
    const [appointments, setAppointments] = useState(null)

    useEffect(() => {
        const fetchUserAppointments = async () => {
            try {
                const appointments = await getUserAppointments();
                setAppointments(appointments);
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
            <button className="add-appointment-btn">Add appointment</button>
            <div className="appointment-section">
                {/* {appointments &&
                    <Table data={appointments} />
                }
                {appointments &&
                    <Table titles={[
                        'appointmentDateTime',
                        'employeeName',
                        'id',
                        'treatmentDuration',
                        'treatmentPrice',
                        'treatmentType'
                    ]} data={appointments} />
                } */}
            </div>
            {/* {appointments && appointments.map(appointment => {
                return (
                    <article key={appointment.appointmentID} className="appointment">
                          <pre>{JSON.stringify(appointment, null, 2)}</pre>
                    </article>
                )
            })} */}
        </section>
    )
}
