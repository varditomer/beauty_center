import React from 'react'
import employeeImg from '../assets/images/employee.png';
import treatmentImg from '../assets/images/treatment.png';
import appointmentImg from '../assets/images/appointment.png';
export default function Home() {
    return (
        <section className="home-page">
            <p>
                Welcome to our beauty center!

                We offer a wide range of beauty and skincare services, including skincare, makeup, hair styling and coloring,

                nail care, hair removal, massage, body care, and more.

                You can easily book an appointment through our reliable website.

                We look forward to welcoming you and providing you with exceptional

                beauty services. Thank you for choosing our beauty center,

                and we are ready to meet your beauty care needs and desires!
            </p>
            <div className="image-container">
                <figure>
                    <a href="/employees"><img src={employeeImg} alt="employee" /></a>
                    <figcaption>Employees</figcaption>
                </figure>
                <figure>
                    <a href="/treatments"><img src={treatmentImg} alt="treatment" /></a>
                    <figcaption>Treatments</figcaption>
                </figure>
                <figure>
                    <a href="/appointment"><img src={appointmentImg} alt="appointment" /></a>
                    <figcaption> appointment</figcaption>
                </figure>
            </div>
        </section>
    )
}
