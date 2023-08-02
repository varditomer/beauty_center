import { useEffect, useState } from "react";

export default function AppointmentTable({ appointments }) {


  const titles = ['Date','Time', 'Type', 'Duration', 'Price', 'Therapist']

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
          return  <div key={idx} className="row">
              <div className="cell" data-title={titles[0]}>
                {appointment.appointmentDateTime.substring(0,10)}
              </div>
              <div className="cell" data-title={titles[1]}>
                {appointment.appointmentDateTime.substring(11,16)}
              </div>
              <div className="cell" data-title={titles[2]}>
                {appointment.treatmentType}
              </div>
              <div className="cell" data-title={titles[3]}>
                {appointment.treatmentDuration} min
              </div>
              <div className="cell" data-title={titles[4]}>
                {appointment.treatmentPrice}₪
              </div>
              <div className="cell" data-title={titles[5]}>
                {appointment.employeeName}
              </div>
            </div>
          })}
        </div>
      }
    </>
  )
}

