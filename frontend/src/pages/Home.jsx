import React, { useEffect, useState } from 'react'
import employeeImg from '../assets/images/employee.png';
import treatmentImg from '../assets/images/treatment.png';
import appointmentImg from '../assets/images/appointment.png';
import { Link } from 'react-router-dom';
export default function Home({ loggedInUser, BASE_URL }) {


    const [nextAppointment, setNextAppointment] = useState(null)


    useEffect(() => {
        const fetchUserAppointments = async () => {
            try {
                const appointments = await getUserNextAppointment();

                if (appointments.length) {
                    const utcDateTime = new Date(appointments[0].appointmentDateTime);
                    const localDateTimeString = utcDateTime.toISOString();
                    appointments[0].appointmentDateTime = localDateTimeString
                    setNextAppointment(appointments[0])
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserAppointments();
    }, []);



    const getUserNextAppointment = async () => {
        const endpoint = loggedInUser.isEmployee ? "nextTreatment" : "nextAppointment"
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
            {nextAppointment &&
                <div className="next-appointment-container">
                    <h3>{loggedInUser.isEmployee ? "Your next treatment" : "Your next appointment"}</h3>
                    <ul className='next-appointment-info'>
                        <li className='info-item'>Date: <span className="item-content">{nextAppointment.appointmentDateTime.substring(0, 10)}</span></li>
                        <li className='info-item'>Time: <span className="item-content">{nextAppointment.appointmentDateTime.substring(11, 16)}</span></li>
                        <li className='info-item'>{loggedInUser.isEmployee ? "Patient" : "Therapist"}: <span className="item-content">{loggedInUser.isEmployee ? nextAppointment.customerName : nextAppointment.employeeName}</span></li>
                        <li className='info-item'>Price: <span className="item-content">{nextAppointment.treatmentPrice}₪</span></li>
                        <li className='info-item'>Type: <span className="item-content">{nextAppointment.treatmentType}</span></li>
                        <li className='info-item'>Duration: <span className="item-content">{nextAppointment.treatmentDuration} min</span></li>
                    </ul>
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
