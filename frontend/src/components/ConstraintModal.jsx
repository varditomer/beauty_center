import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const styleDatepicker = {
    padding: '0 2px'
}

export default function ConstraintModal({ setIsAddingConstraint, onAddConstraint }) {



    function isSaturday(date) {
        const day = dayjs(date).get('day')
        // Check if the day of the week is Saturday (6)
        return day === 6;
    }

    const [open, setOpen] = useState(true);
    const [minDate, setMinDate] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState(null)
    const [selectedStartTime, setSelectedStartTime] = useState('')
    const [selectedEndTime, setSelectedEndTime] = useState('')
    const [constraintDescription, setConstraintDescription] = useState('')




    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // const minimumDate = tomorrow.toISOString().split('T')[0]

        // const minimumDate = new Date();
        // minimumDate.setDate(minimumDate.getDate() + 1); // Set the minimum date to tomorrow
        // console.log(`minimumDate:`, minimumDate)
        setMinDate(tomorrow)

        const timeSlots = generateSlots()
        setTimeSlots(timeSlots)

    }, [])

    function generateSlots() {
        const patientAcceptStart = "08:00", patientAcceptEnd = "20:00", treatmentDuration = 30
        const appointmentSlots = [];
        const currentDate = new Date();

        // Parse the hours and minutes from patientAcceptStart
        const [startHours, startMinutes] = patientAcceptStart.split(':');

        // Set the current slot start time to the provided hours and minutes
        currentDate.setHours(startHours);
        currentDate.setMinutes(startMinutes);

        // Parse the hours and minutes from patientAcceptEnd
        const [endHours, endMinutes] = patientAcceptEnd.split(':');

        const endTime = new Date();
        endTime.setHours(endHours);
        endTime.setMinutes(endMinutes);
        // currentDate.setHours(currentDate.getHours() + 3)
        while (currentDate <= endTime) {
            const date = structuredClone(currentDate)
            date.setHours(currentDate.getHours() + 3)
            appointmentSlots.push({ start: new Date(date).toISOString() });

            currentDate.setMinutes(currentDate.getMinutes() + treatmentDuration);
        }
        return appointmentSlots;
    }

    const onSelectStartTime = (event) => {
        const treatmentTimeStart = event.target.value.substring(11, 16)
        setSelectedStartTime(treatmentTimeStart)
    }

    const onSelectEndTime = (event) => {
        const treatmentTimeEnd = event.target.value.substring(11, 16)
        setSelectedEndTime(treatmentTimeEnd)
    }

    const onDescriptionChange = (event) => {
        const description = event.target.value
        setConstraintDescription(description)
    }

    const handleDateChange = (date) => {
        const formattedDate = dayjs(date)
        setSelectedDate(formattedDate);
    };


    const handleClose = () => {
        setIsAddingConstraint(false)
        setOpen(false)
    };



    function handleAddConstraint() {
        // Get input values using document.querySelector
        // const date = document.querySelector('#date').value;
        const date = selectedDate.format('YYYY-MM-DD')
        const constraintStart = selectedStartTime;
        const constraintEnd = selectedEndTime;
        const description = constraintDescription;

        // Create an object to represent the constraint data
        const constraintDetails = {
            date: date,
            constraintStart: constraintStart,
            constraintEnd: constraintEnd,
            description: description
        };

        onAddConstraint(constraintDetails)
        handleClose()

    }


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <section className="add-appointment-page">
                        <div className="add-appointment-container">

                            {minDate &&
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer sx={styleDatepicker} components={['DatePicker']}>
                                        <DatePicker
                                            label="Date"
                                            value={selectedDate}
                                            shouldDisableDate={isSaturday}
                                            onChange={handleDateChange}
                                            minDate={dayjs(minDate)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            }

                            {!!timeSlots &&
                                <>
                                    {/* Select start & end time */}
                                    <label htmlFor="slot">Select Start Time:</label>
                                    <select id="slot" onChange={onSelectStartTime}>
                                        <option value="">Select Constraint Start</option>
                                        {timeSlots.map((time, index) => {
                                            return (
                                                <option key={index} value={time.start}>
                                                    {time.start.substring(11, 16)}
                                                </option>
                                            )
                                        })}
                                    </select>
                                    <label htmlFor="constraintStart">Select End TIme:</label>
                                    <select id="constraintStart" onChange={onSelectEndTime}>
                                        <option value="">Select Constraint End</option>
                                        {timeSlots.map((time, index) => {
                                            return (
                                                <option key={index} value={time.start}>
                                                    {time.start.substring(11, 16)}
                                                </option>
                                            )
                                        })
                                        }
                                    </select>
                                </>
                            }

                            <label htmlFor="description">Description:</label>
                            <textarea style={{ marginBottom: "20px" }} id="description" name="description" rows="4" cols="50" required onChange={onDescriptionChange}></textarea>
                        </div>
                        <button
                            className="add-appointment-btn"
                            style={{ width: "100%" }}
                            onClick={handleAddConstraint}
                            disabled={!selectedDate || !selectedStartTime || !selectedEndTime || !constraintDescription}
                        >
                            Add Constraint
                        </button>
                    </section>
                </Box>
            </Modal>
        </div >
    );
}
