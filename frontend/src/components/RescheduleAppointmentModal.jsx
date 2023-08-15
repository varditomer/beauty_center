import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMessage from '../components/UserMessage';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function RescheduleAppointmentModal({ loggedInUser, BASE_URL, setIsRescheduleAppointment, appointmentToReschedule}) {
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setIsRescheduleAppointment(false)
        setOpen(false)
    };


    // State variables for various data
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [treatments, setTreatments] = useState(null)
    const [selectedTreatment, setSelectedTreatment] = useState(null)
    const [daysOptions, setDaysOptions] = useState(null)
    const [selectedDay, setSelectedDay] = useState('');
    const [employees, setEmployees] = useState(null)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [slots, setSlots] = useState(null)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const navigate = useNavigate()


    // Getting treatments from the server
    useEffect(() => {
        setSelectedTreatment(appointmentToReschedule.treatmentType)
        const daysOptions = generateDaysOptions()
        setDaysOptions(daysOptions)
    }, []);

    // Function to generate 7 days options from the current day
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

    // Function to handle day selection
    const onSelectDay = async (event) => {
        const selectedDate = new Date(event.target.value);
        const formattedDate = selectedDate.toISOString();
        setSelectedDay(formattedDate);
        const employees = await fetchEmployeesByTreatmentId(appointmentToReschedule.treatmentId)
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
        const availableHours = await fetchEmployeeAvailableHoursByTreatment(selectedEmployee, appointmentToReschedule.treatmentId)

        // Extract start and end time from available hours
        const { patientAcceptStart, patientAcceptEnd } = availableHours[0]

        // Extract treatment duration
        const treatmentDuration = appointmentToReschedule.treatmentDuration

        // 2. Generating treatments slots according to start-end time
        console.log(`patientAcceptStart:`, patientAcceptStart)
        console.log(`patientAcceptEnd:`, patientAcceptEnd)
        console.log(`treatmentDuration:`, treatmentDuration)
        const treatmentsSlots = generateAppointmentSlots(patientAcceptStart, patientAcceptEnd, treatmentDuration)
        console.log(`treatmentsSlots:`, treatmentsSlots)

        // 3. Getting employee's appointments for the selected date
        const employeeAppointments = await fetchEmployeeAppointments(selectedEmployee, selectedDay)
        console.log(`employeeAppointments:`, employeeAppointments)

        // 4. Getting customer's appointments for the selected date
        const customerAppointments = await fetchCustomerAppointments(loggedInUser.isEmployee? appointmentToReschedule.customerId : loggedInUser.id, selectedDay)
        console.log(`customerAppointments:`, customerAppointments)

        // 5. Filtering the available slots by already assigned employee's and customer's appointments
        const filteredByEmployeesAppointmentsSlots = filterSlotsByAppointments(treatmentsSlots, employeeAppointments, treatmentDuration);
        const filteredSlots = filterSlotsByAppointments(filteredByEmployeesAppointmentsSlots, customerAppointments, treatmentDuration);
        setSlots(filteredSlots)
    }

    // 1. Function to fetch employee's available hours by treatment
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

    // 2. Function to generate appointment slots
    function generateAppointmentSlots(patientAcceptStart, patientAcceptEnd, treatmentDuration) {
        const appointmentSlots = [];
        const currentDate = new Date(selectedDay);
        console.log(`currentDate:`, currentDate)

        // Parse the hours and minutes from patientAcceptStart
        const [startHours, startMinutes] = patientAcceptStart.split(':');

        // Set the current slot start time to the provided hours and minutes
        currentDate.setHours(startHours);
        currentDate.setMinutes(startMinutes);

        // Parse the hours and minutes from patientAcceptEnd
        const [endHours, endMinutes] = patientAcceptEnd.split(':');

        const endTime = new Date(selectedDay);
        endTime.setHours(endHours);
        endTime.setMinutes(endMinutes - treatmentDuration);
        console.log(`endTime:`, endTime)
        // currentDate.setHours(currentDate.getHours() + 3)
        while (currentDate <= endTime) {
            const date = structuredClone(currentDate)
            date.setHours(currentDate.getHours() + 3)
            appointmentSlots.push({ start: new Date(date).toISOString() });

            currentDate.setMinutes(currentDate.getMinutes() + treatmentDuration);
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
        console.log(`appointmentToReschedule:`, appointmentToReschedule)
        const appointmentDateTime = event.target.value
        const rescheduledAppointment = {
            appointmentDateTime,
            employeeId: +selectedEmployee,
            customerId: +appointmentToReschedule.customerId,
            treatmentId: +appointmentToReschedule.treatmentId,
            appointmentId: appointmentToReschedule.id
        }
        setSelectedAppointment(rescheduledAppointment)
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
    const fetchAddNewAppointment = async (rescheduledAppointment) => {
        console.log(`rescheduledAppointment:`, rescheduledAppointment)
        try {
            const response = await fetch(`${BASE_URL}/appointment/updateAppointment`, {
                method: 'PUT',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ rescheduledAppointment })
            });
            const employees = await response.json();
            return employees
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    return (
        <div>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <section className="add-appointment-page">
                        <div className="add-appointment-container">
                            <h1 className='page-title'>Reschedule Appointment</h1>
                            {/* Select treatment */}
                            <>
                                <label htmlFor="weekday">Treatment Type:</label>
                                <span>{appointmentToReschedule.treatmentType}</span>
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
                            {/* Add appointment */}
                            {!!appointmentToReschedule &&
                                <button className="add-appointment-btn" onClick={onAddAppointment}>
                                    Reschedule
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
                </Box>
            </Modal>
        </div>
    );
}
