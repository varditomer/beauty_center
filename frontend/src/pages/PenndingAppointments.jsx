import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

export default function PenndingAppointments({ loggedInUser, BASE_URL }) {


    console.log(useParams().id);
    const [appointment, setAppointment] = useState(null)

    const titles = ['Date', 'Time', 'Type', 'Duration', 'Price', `${loggedInUser.isEmployee ? 'Customer' : 'Therapist'}`]

    const id = useParams().id

    useEffect(() => {
        const getPenddingAppointment = async () => {
            try {
                const appointment = await fetchPenddingAppointment(id);
                console.log(appointment);
                setAppointment(appointment)
            } catch (error) {
                console.error(error);
            }
        };
        getPenddingAppointment();
    }, []);

    const fetchPenddingAppointment = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/pendding/${id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const penddingAppointment = await response.json();
            return penddingAppointment;
        } catch (error) {
            console.error(error);
            return null;
        }
    };


    return (
        <>
                <h1 className="page-title">Pendding Appointment</h1>
            {appointment &&
                <div className="custom-table">
                    {/* Table Header */}
                    <div className="row header">
                        {titles.map((title) => {

                            return <div key={title} className="cell">
                                {title}
                            </div>
                        })}
                    </div>
                    {/* Table Rows */}
                    <div className="row">
                        <div className="cell" data-title={titles[0]}>
                            {appointment.appointmentDateTime.substring(0, 10)}
                        </div>
                        <div className="cell" data-title={titles[1]}>
                            {appointment.appointmentDateTime.substring(11, 16)}
                        </div>
                        <div className="cell capitalize" data-title={titles[2]}>
                            {appointment.treatmentType}
                        </div>
                        <div className="cell" data-title={titles[3]}>
                            {appointment.treatmentDuration} min
                        </div>
                        <div className="cell" data-title={titles[4]}>
                            {appointment.treatmentPrice}₪
                        </div>
                        <div className="cell capitalize" data-title={titles[5]}>
                            {
                                appointment.employeeName
                            }
                        </div>

                    </div>
                    <div style={{display:'flex',padding:'20px',gap:"40px"}} className="btn-container">
                    <div className='add-appointment-btn'>Aproove</div>
                    <div style={{backgroundColor:"red"}} className='add-appointment-btn'>Cancel</div>
                    </div>
                </div>
            }
        </>
    )
}


