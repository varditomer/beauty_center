import { useEffect, useState } from 'react';

export default function AddAppointment({ BASE_URL, loggedInUser }) {

    const [treatments, setTreatments] = useState(null)
    const [selectedTreatment, setSelectedTreatment] = useState(null)
    const [daysOptions, setDaysOptions] = useState(null)
    const [selectedDay, setSelectedDay] = useState('');
    const [employees, setEmployees] = useState(null)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [slots, setSlots] = useState(null)


    // Getting treatments from the server
    useEffect(() => {
        const getTreatments = async () => {
            try {
                const treatments = await fetchTreatments();
                setTreatments(treatments);
            } catch (error) {
                console.error(error);
            }
        };
        getTreatments();
    }, []);

    //  Functions:

    // Get treatments type from back
    const fetchTreatments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/treatment`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const treatments = await response.json();
            return treatments;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    function onSelectTreatment(selectedTreatment) {
        setEmployees(null)
        setSlots(null)
        // 
        setSelectedTreatment(selectedTreatment)
        const daysOptions = generateDaysOptions()
        setDaysOptions(daysOptions)
    }

    // Generating 7 Days options from current day
    const generateDaysOptions = () => {
        const today = new Date();

        // Calculate the options for the next 7 business days (Monday to Friday)
        const options = [];
        let count = 0;
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        while (options.length < 7) {
            const date = new Date(today);
            date.setDate(today.getDate() + count);
            const dayOfWeek = date.getDay();

            if (dayOfWeek >= 0 && dayOfWeek <= 4) {
                const dayName = daysOfWeek[dayOfWeek];
                options.push(
                    { dayName, date }
                );
            }
            count++;
        }
        return options
    }

    const onSelectDay = async (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = selectedDate.toISOString();
        setSelectedDay(formattedDate);
        const employees = await fetchEmployeesByTreatmentId(selectedTreatment)
        setEmployees(employees)
    }

    const fetchEmployeesByTreatmentId = async (treatmentId) => {
        try {
            const response = await fetch(`${BASE_URL}/employee/byTreatmentId/${treatmentId}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const employees = await response.json();
            return employees
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    async function onSelectEmployee(event) {
        // Set selected employee
        const selectedEmployee = event.target.value
        setSelectedEmployee(selectedEmployee)

        // Get selected employee available hours
        const availableHours = await fetchEmployeeAvailableHoursByTreatment(selectedEmployee, selectedTreatment)

        // Extract start and end time from available hours
        const { patientAcceptStart, patientAcceptEnd } = availableHours[0]

        // Extract treatment duration
        const treatmentDuration = treatments[selectedTreatment - 1].duration

        // Generating treatments slots according to start-end time
        const treatmentsSlots = generateAppointmentSlots(patientAcceptStart, patientAcceptEnd, treatmentDuration)

        // Getting employee's appointments for the selected date
        const employeeAppointments = await fetchEmployeesAppointments(selectedEmployee, selectedDay)

        // Filtering the available slots by already assigned employee's appointments
        const filteredSlots = filterSlotsByAppointments(treatmentsSlots, employeeAppointments);
        setSlots(filteredSlots)
    }

    function filterSlotsByAppointments(slots, appointments) {
        const filteredSlots = slots.filter(slot => {
            const slotTime = slot.start.substring(11, 16)

            // Check if the slot time matches any of the appointment times
            return !appointments.some(appointment => {
                const appointmentTime = appointment.appointmentDateTime.substring(11, 16)
                return slotTime === appointmentTime;
            });
        });

        return filteredSlots;
    }


    const fetchEmployeeAvailableHoursByTreatment = async (selectedEmployee, selectedTreatment) => {
        try {
            const response = await fetch(`${BASE_URL}/employee/employeeAvailableHoursByTreatmentId`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ employeeId: selectedEmployee, treatmentId: selectedTreatment })
            });
            const employeesAvailableHours = await response.json();
            return employeesAvailableHours
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const fetchEmployeesAppointments = async (selectedEmployee, date) => {
        try {
            const response = await fetch(`${BASE_URL}/employee/employeeAppointmentsByDay`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ employeeId: selectedEmployee, date })
            });
            const employeeAppointments = await response.json();
            return employeeAppointments
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const onSelectAppointment = (event) => {
        const appointmentDateTime = event.target.value
        const newAppointment = {
            appointmentDateTime,
            employeeId: selectedEmployee,
            customerId: loggedInUser.id,
            treatmentId: selectedTreatment
        }
        fetchAddNewAppointment(newAppointment)
    }

    const fetchAddNewAppointment = async (newAppointment) => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/addAppointment`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ newAppointment })
            });
            const employees = await response.json();
            console.log(`employees:`, employees)
            return employees
        } catch (error) {
            console.error(error);
            return [];
        }
    };


    function generateAppointmentSlots(patientAcceptStart, patientAcceptEnd, treatmentDuration) {
        const appointmentSlots = [];
        const currentDate = new Date(selectedDay);

        // Parse the hours and minutes from patientAcceptStart
        const [startHours, startMinutes] = patientAcceptStart.split(':');

        // Set the current slot start time to the provided hours and minutes
        currentDate.setHours(startHours);
        currentDate.setMinutes(startMinutes);

        // Parse the hours and minutes from patientAcceptEnd
        const [endHours, endMinutes] = patientAcceptEnd.split(':');

        const endTime = new Date(selectedDay);
        endTime.setHours(endHours);
        endTime.setMinutes(endMinutes);

        while (currentDate <= endTime) {
            appointmentSlots.push({ start: new Date(currentDate).toISOString() });

            currentDate.setMinutes(currentDate.getMinutes() + treatmentDuration);
        }
        return appointmentSlots;
    }


    return (
        <section className="add-appointment-page">
            <div className="add-appointment-container">
                <h1>Add new appointment</h1>
                {/* Select treatment */}
                <>
                    <label htmlFor="weekday">Select Treatment:</label>
                    <select id='treatmentType' className="select-treatment" onChange={(event) => onSelectTreatment(event.target.value)}>
                        <option value="">Select Treatment Type</option>
                        {treatments &&
                            treatments.map((treatment) => (
                                <option key={treatment.id} value={treatment.id}>
                                    {treatment.treatmentType}
                                </option>
                            ))
                        }
                    </select>
                </>
                {/* -------------------- */}

                {/* Select appointment day */}
                {daysOptions &&
                    <>
                        <label htmlFor="weekday">Select a Day:</label>
                        <select id="weekday" onChange={onSelectDay}>
                            <option value="">Select a day</option>
                            {daysOptions.map((option, index) => {
                                return (
                                    <option key={index} value={option.date}>
                                        {option.dayName} ({option.date.toLocaleDateString()})
                                    </option>
                                )
                            })
                            }
                        </select>
                    </>
                }
                {/* -------------------- */}

                {/* Select employee */}
                {employees &&
                    <>
                        <label htmlFor="employee">Select employee:</label>
                        <select id="employee" onChange={onSelectEmployee}>
                            <option value="">Select an employee</option>
                            {employees.map((employee, index) => {
                                return (
                                    <option key={index} value={employee.id}>
                                        {employee.name}
                                    </option>
                                )
                            })
                            }
                        </select>
                    </>
                }
                {/* -------------------- */}

                {/* Select appointment */}
                {slots &&
                    <>
                        <label htmlFor="slot">Select Appointment from Available:</label>
                        <select id="slot" onChange={onSelectAppointment}>
                            <option value="">Select appointment</option>
                            {slots.map((appointment, index) => {
                                return (
                                    <option key={index} value={appointment.start}>
                                        {appointment.start.substring(11, 16)}
                                    </option>
                                )
                            })
                            }
                        </select>
                    </>
                }
                {/* -------------------- */}

            </div>
        </section>
    )
}