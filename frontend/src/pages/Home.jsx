import React, { useEffect, useState } from 'react'
import employeeImg from '../assets/images/employee.png';
import treatmentImg from '../assets/images/treatment.png';
import appointmentImg from '../assets/images/appointment.png';
import { Link } from 'react-router-dom';
import AppointmentTable from '../components/AppointmentTable';
export default function Home({ loggedInUser, BASE_URL }) {


    // const [nextAppointment, setNextAppointment] = useState(null)
    const [appointments, setAppointments] = useState(null);
    const [revenue, setRevenue] = useState(null);

    useEffect(() => {
        const fetchUserAppointments = async () => {
            try {
                const appointments = await getUserNextAppointment();
                console.log(appointments);
                if (loggedInUser.isEmployee) {
                    const employeeRevenue = await getEmployeeRevenue()
                    setRevenue(employeeRevenue.monthlyTotal)
                }
                if (appointments.length) {
                    setAppointments(appointments)
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserAppointments();
    }, []);



    const getUserNextAppointment = async () => {
        const endpoint = loggedInUser.isEmployee ? "nextTreatments" : "nextAppointments"
        try {
            const response = await fetch(`${BASE_URL}/appointment/${endpoint}/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const nextAppointment = await response.json();
            return nextAppointment;
        } catch (error) {
            console.error(error);
            return [];
        }
    };


    const getEmployeeRevenue = async () => {
        const endpoint = "revenue"
        try {
            const response = await fetch(`${BASE_URL}/appointment/${endpoint}/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const nextAppointment = await response.json();
            return nextAppointment;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    return (
        <section className="home-page">
            <h1>Welcome {loggedInUser.isEmployee ? "Employee " : "Patient "} <span className='capitalized emphasized'>{loggedInUser.name}</span> to our beauty center!</h1>
            <p>
                We offer a wide range of beauty and skincare services, including skincare,
                <span className='capitalized emphasized'> makeup, hair styling and coloring,
                    nail care, hair removal, massage, body care
                </span>
                , and more.
                You can easily book an appointment through our reliable website.
                We look forward to welcoming you and providing you with exceptional
                beauty services. Thank you for choosing our beauty center,
                and we are ready to meet your beauty care needs and desires!
            </p>
            {((appointments && appointments.length) || revenue !== null) &&
                <div className="appointment-info-container">
                    {appointments && <>
                        <div className="next-appointment-container">
                            <h3 className='page-title'>{loggedInUser.isEmployee ? "today's treatments" : "today's appointments"}</h3>
                            <AppointmentTable setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={appointments} loggedInUser={loggedInUser} />
                        </div>
                    </>
                    }
                    {revenue !== null &&
                        <div className="revenue-container">
                            <h3 style={{ color: "white" }}>Month's Expected Revenues: <span className="revenue">{revenue}₪</span></h3>
                        </div>
                    }
                </div>
            }
            <div className="image-container">
                {!loggedInUser.isEmployee &&
                    <Link className="img-link" to='/employees'>
                        <img src={employeeImg} alt="employee" />
                        <span className='capitalized emphasized'>Employees</span>
                    </Link>
                }
                <Link className="img-link" to='/treatments'>
                    <img src={treatmentImg} alt="treatments" />
                    <span className='capitalized emphasized'>Treatment</span>
                </Link>
                <Link className="img-link" to='/appointments'>
                    <img src={appointmentImg} alt="appointments" />
                    <span className='capitalized emphasized'>appointments</span>
                </Link>
            </div>
        </section>
    )
}
