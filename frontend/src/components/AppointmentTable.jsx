export default function AppointmentTable({ appointments, BASE_URL, setAppointments, loggedInUser }) {


  const titles = ['Date', 'Time', 'Type', 'Duration', 'Price', `${loggedInUser.isEmployee ? 'Customer' : 'Therapist'}`, '']

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
      const newAppointments = appointments.filter(appointment => appointment.id !== res)
      setAppointments(newAppointments)
      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  return (
    <>
      {appointments &&
        <div className="custom-table">
          {/* Table Header */}
          <div className="row header">
            {titles.map((title) => (
              <div key={title} className="cell">
                {title}
              </div>
            ))}
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
              <div className="cell" style={{ justifyContent: "center", alignItems: "center" }}>
                <div onClick={() => onRemoveAppointment(appointment)} title="Remove-appointment" className="remove-btn">X</div>
              </div>
            </div>
          })}
        </div>
      }
    </>
  )
}

