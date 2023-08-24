import { useState } from "react";
import RescheduleAppointmentModal from "./RescheduleAppointmentModal";
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

export default function AppointmentTable({ appointments, BASE_URL, setAppointments, loggedInUser, isCanceledAppointment = false, removeAppoitment = () => null }) {


  const titles = ['Date', 'Time', 'Type', 'Duration', 'Price', `${loggedInUser.isEmployee ? 'Customer' : 'Therapist'}`, '']
  const [isRescheduleAppointment, setIsRescheduleAppointment] = useState(false)
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null)


  const onRemoveAppointment = async (appointmentToRemove) => {
    try {
      const response = await fetch(`${BASE_URL}/appointment/removeAppointment/${appointmentToRemove.id}`, {
        method: 'Delete',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
      });
      const res = await response.json();
      const newAppointments = appointments.filter(appointment => appointment.id !== +res)
      const newCanceledAppointment = appointments.filter(appointment => appointment.id === +res)
      setAppointments(newAppointments)
      removeAppoitment(newAppointments,newCanceledAppointment)
      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const onRescheduleAppointment = (appointment) => {
    setAppointmentToReschedule(appointment)
    setIsRescheduleAppointment(true)
    
  }

  return (
    <>
      {isRescheduleAppointment &&
        <RescheduleAppointmentModal
          loggedInUser={loggedInUser}
          BASE_URL={BASE_URL}
          setIsRescheduleAppointment={setIsRescheduleAppointment}
          appointmentToReschedule={appointmentToReschedule}
        />
      }
      {appointments &&
        <div className="custom-table">
          {/* Table Header */}
          <div className="row header">
            {titles.map((title) => {
              if (isCanceledAppointment && title === '') return
              return <div key={title} className="cell">
                {title}
              </div>
            })}
          </div>
          {/* Table Rows */}
          {appointments.map((appointment, idx) => {
            return <div key={idx} className="row">
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
                {loggedInUser.isEmployee ?
                  appointment.customerName
                  :
                  appointment.employeeName
                }
              </div>
              {!isCanceledAppointment &&
                <div className="cell" style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>

                  <div onClick={() => onRemoveAppointment(appointment)} title="Remove-appointment" className="remove-btn">
                    <DeleteOutlineTwoToneIcon />
                  </div>
                  <div onClick={() => onRescheduleAppointment(appointment)} title="Remove-appointment" className="remove-btn">
                    <EditCalendarTwoToneIcon />
                  </div>
                </div>
              }
            </div>
          })}
        </div>
      }
    </>

  )
}

