import React from 'react'
import employeeImg from '../assets/images/employee1.png';

export default function Employees() {
    return (
        <section className="employees-page">
            <div className="image-section">
                <div className="image-container">
                    <img src={employeeImg} alt="Image 1" />
                    <p className="caption">adel Jon... She works in manicure,
                        <span className="text-highlight">pedicure</span> ,<span className="text-highlight">massage</span>, and <span className="text-highlight">makeup</span>.
                    </p>
                </div>
                <div className="image-container">
                    <img src={employeeImg} alt="Image 2" />
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
                    <img src={employeeImg} alt="Image 3" />
                    <p>Paragraph 3</p>
                </div>
            </div>
        </section>
    )
}
