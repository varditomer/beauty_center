import React from 'react'
import employeeImg from '../assets/images/employee.png';
import treatmentImg from '../assets/images/treatment.png';
import appointmentImg from '../assets/images/appointment.png';
import { Link } from 'react-router-dom';
export default function Home() {
    return (
        <section className="home-page">
            <h1>Welcome to our beauty center!</h1>
            <p>
                We offer a wide range of beauty and skincare services, including skincare, makeup, hair styling and coloring,

                nail care, hair removal, massage, body care, and more.

                You can easily book an appointment through our reliable website.

                We look forward to welcoming you and providing you with exceptional

                beauty services. Thank you for choosing our beauty center,

                and we are ready to meet your beauty care needs and desires!
            </p>
            <div className="image-container">
                    <Link to='/employees'>
                        <div className="link-container">
                        <img src={employeeImg} alt="employee" />
                        <span>Employees</span>
                        </div>
                    </Link>
                    <Link to='/treatments'>
                        <img src={treatmentImg} alt="treatments" />
                        <span>Treatment</span>
                    </Link>
                    <Link to='/appointments'>
                        <img src={appointmentImg} alt="appointments" />
                        <span>appointments</span>
                    </Link>
            </div>
        </section>
    )
}
