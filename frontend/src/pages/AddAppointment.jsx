import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMessage from '../components/UserMessage';

export default function AddAppointment({ BASE_URL, loggedInUser }) {

    // State variables for various data
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [treatments, setTreatments] = useState(null)
    const [selectedTreatment, setSelectedTreatment] = useState(null)
    const [minDate, setMinDate] = useState('')
    const [dateToShow, setDateToShow] = useState('')
    const [selectedDay, setSelectedDay] = useState('');
    const [employees, setEmployees] = useState(null)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [slots, setSlots] = useState(null)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const navigate = useNavigate()


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

    // Function to fetch treatments from the server
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

    // Function to handle treatment selection
    async function onSelectTreatment(selectedTreatment) {
        // Reset employees and slots as treatment changes
        setEmployees(null)
        setSlots(null)

        // Set the selected treatment
        setSelectedTreatment(selectedTreatment)

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const minimumDate = tomorrow.toISOString().split('T')[0]
        setMinDate(minimumDate)
    }


    //-------------------------------------------------------

    // Function to handle day selection
    const onSelectDay = async (event) => {
        setDateToShow(event.target.value)
        const selectedDate = new Date(event.target.value);
        const formattedDate = selectedDate.toISOString();
        setSelectedDay(formattedDate)
        const employees = await fetchEmployeesByTreatmentId(selectedTreatment)
        setEmployees(employees)
    }

    // Function to fetch employees by treatment ID
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

    // Function to handle employee selection
    async function onSelectEmployee(event) {
        // Set selected employee
        const selectedEmployee = event.target.value
        setSelectedEmployee(selectedEmployee)

        // 1. Get selected employee available hours
        const availableHours = await fetchEmployeeAvailableHoursByTreatmentIdAndDay(selectedEmployee, selectedTreatment, selectedDay)
        if (!availableHours.length) {
            setUserMessage('Employee is unavailable for this day!')
            setTimeout(() => {
                setUserMessage('')
            }, 2000);
        } else {

            const constraints = await fetchEmployeeConstraintsByDate(selectedEmployee, selectedDay)

            // Extract start and end time from available hours
            const { patientAcceptStart, patientAcceptEnd } = availableHours[0]

            // Extract treatment duration
            const treatmentDuration = treatments[selectedTreatment - 1].duration

            // 2. Generating treatments slots according to start-end time and constraints
            const treatmentsSlots = generateAppointmentSlots(patientAcceptStart, patientAcceptEnd, treatmentDuration, constraints)

            // 3. Getting employee's appointments for the selected date
            const employeeAppointments = await fetchEmployeeAppointments(selectedEmployee, selectedDay)

            // 4. Getting customer's appointments for the selected date
            const customerAppointments = await fetchCustomerAppointments(loggedInUser.id, selectedDay)

            // 5. Filtering the available slots by already assigned employee's and customer's appointments
            const filteredByEmployeesAppointmentsSlots = filterSlotsByAppointments(treatmentsSlots, employeeAppointments, treatmentDuration);
            const filteredSlots = filterSlotsByAppointments(filteredByEmployeesAppointmentsSlots, customerAppointments, treatmentDuration);
            setSlots(filteredSlots)

        }

    }

    const fetchEmployeeConstraintsByDate = async (selectedEmployee, selectedDay) => {
        const date = selectedDay.substring(0, 10)
        try {
            const response = await fetch(`${BASE_URL}/employee/employeeConstraintsByDate`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ employeeId: selectedEmployee, date })
            });
            const employeeConstraints = await response.json();
            return employeeConstraints[0]
        } catch (error) {
            console.error(error);
            return [];
        }
    };
    
    // 1. Function to fetch employee's available hours by treatment and date
    const fetchEmployeeAvailableHoursByTreatmentIdAndDay = async (selectedEmployee, selectedTreatment, formattedDate) => {
        const date = new Date(formattedDate)
        const day = date.getDay()
        try {
            const response = await fetch(`${BASE_URL}/employee/employeeAvailableHoursByTreatmentIdAndDay`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ employeeId: selectedEmployee, treatmentId: selectedTreatment, day })
            });
            const employeesAvailableHours = await response.json();
            return employeesAvailableHours
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // 2. Function to generate appointment slots
    function generateAppointmentSlots(patientAcceptStart, patientAcceptEnd, treatmentDuration, constraints = null) {
        const appointmentSlots = [];
        const selectedDate = new Date(selectedDay);

        let constraintStart
        let constraintEnd
        let constraintDuration

        if (constraints) {
            constraintStart = +(constraints.constraintStart.substring(0, 2))
            constraintEnd = +(constraints.constraintEnd.substring(0, 2))
            constraintDuration = (constraintEnd - constraintStart) * 60
        }

        // Parse the hours and minutes from patientAcceptStart
        const [startHours, startMinutes] = patientAcceptStart.split(':');

        // Parse the hours and minutes from patientAcceptEnd
        const [endHours, endMinutes] = patientAcceptEnd.split(':');

        // Validating current day add appointment
        const currentDate = new Date()
        const [currentDay, currentHour, currentMinutes] = [currentDate.getDay(), currentDate.getHours(), currentDate.getMinutes()]
        if (currentDay === selectedDate.getDay()) {

            if (currentHour >= endHours) return [] // if the current hour pass the patient accept end hour => return empty slots array.

            // Set the current slot start time to the provided hours and minutes
            if (currentDay === selectedDate.getDay() && currentHour >= startHours && currentHour <= endHours) {
                if (currentMinutes > startMinutes && currentMinutes < treatmentDuration) {
                    selectedDate.setMinutes(treatmentDuration)
                    selectedDate.setHours(currentHour);
                } else {
                    selectedDate.setMinutes(startMinutes)
                    selectedDate.setHours(currentHour + 1);
                }
            } else {
                selectedDate.setHours(startHours);
                selectedDate.setMinutes(startMinutes);
            }

        } else {
            selectedDate.setHours(startHours);
            selectedDate.setMinutes(startMinutes);
        }

        const endTime = new Date(selectedDay);
        endTime.setHours(endHours);
        endTime.setMinutes(endMinutes - treatmentDuration);
        while (selectedDate <= endTime) {
            const date = structuredClone(selectedDate)
            date.setHours(selectedDate.getHours() + 3)
            if ((date.getHours() - 3) < constraintEnd && (date.getHours() - 3) >= constraintStart) {
                selectedDate.setMinutes(selectedDate.getMinutes() + constraintDuration);
                continue
            } else {
                appointmentSlots.push({ start: new Date(date).toISOString() });
                selectedDate.setMinutes(selectedDate.getMinutes() + treatmentDuration);
            }

        }
        return appointmentSlots;
    }

    // 3. Function to fetch employee appointments by day
    const fetchEmployeeAppointments = async (selectedEmployee, date) => {
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

    // 4. Function to fetch customer appointments by day
    const fetchCustomerAppointments = async (customerId, date) => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/customerAppointmentsByDay`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ customerId, date })
            });
            const employeeAppointments = await response.json();
            return employeeAppointments
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // 5. Function to filter slots by appointments
    function filterSlotsByAppointments(slots, appointments, treatmentDuration) {
        // Create an array to store the filtered slots
        const filteredSlots = slots.filter(slot => {
            // Calculate the start time of the current slot in minutes
            const slotMinutes = (+slot.start.substring(11, 13) * 60) + (+slot.start.substring(14, 16));

            // Check if the slot time matches any of the appointment times
            // Using the `.some()` method to determine if there's any appointment conflicting with the current slot
            return !appointments.some(appointment => {
                // Calculate the start time of the appointment in minutes
                const appointmentMinutes = (+appointment.appointmentDateTime.substring(11, 13) * 60) + (+appointment.appointmentDateTime.substring(14, 16));

                // Check if there's an overlap between the appointment and the current slot
                // An overlap occurs if the start time of the appointment is within the slot's time range
                // Or if the end time of the appointment is within the slot's time range
                // Also, consider treatment duration for proper comparison
                return (
                    (appointmentMinutes > slotMinutes && (slotMinutes + treatmentDuration) > appointmentMinutes) ||
                    (appointmentMinutes < slotMinutes && (appointmentMinutes + appointment.appointmentDuration) > slotMinutes)
                );
            });
        });

        // Return the filtered slots that do not conflict with any appointments
        return filteredSlots;
    }

    // Function to handle appointment selection
    const onSelectAppointment = (event) => {
        const appointmentDateTime = event.target.value
        const newAppointment = {
            appointmentDateTime,
            employeeId: selectedEmployee,
            customerId: loggedInUser.id,
            treatmentId: selectedTreatment,
            email: loggedInUser.mail
        }
        setSelectedAppointment(newAppointment)
    }

    const onAddAppointment = async () => {
        await fetchAddNewAppointment(selectedAppointment)
        setIsSuccess(true)
        setUserMessage('Appointment was added!')
        setTimeout(() => {
            navigate('/appointments')
        }, 2000);

    }

    // Function to add a new appointment
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
            return employees
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    return (
        <section className="add-appointment-page">
            <div className="add-appointment-container">
                <h1 className='page-title'>Add New Appointment</h1>
                {/* Select treatment */}
                <>
                    <label htmlFor="treatmentType">Select Treatment:</label>
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
                {minDate &&
                    <>
                        <label htmlFor="weekday">Select a Day:</label>
                        <input
                            type="date"
                            id="weekday"
                            value={dateToShow}
                            onChange={onSelectDay}
                            min={minDate}
                        />
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
                        <label htmlFor="slot">Select Appointment time:</label>
                        <select id="slot" onChange={onSelectAppointment}>
                            <option value="">Select Time</option>
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
                {/* Add appointment */}
                {!!selectedAppointment &&
                    <button className="add-appointment-btn" onClick={onAddAppointment}>
                        Add Appointment
                    </button>
                }
                {/* -------------------- */}
                {userMessage.length > 0 &&
                    <UserMessage
                        userMessage={userMessage}
                        setUserMessage={setUserMessage}
                        isSuccess={isSuccess}
                        setIsSuccess={setIsSuccess}
                    />
                }

            </div>
        </section>
    )
}