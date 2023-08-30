import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserMessage from '../components/UserMessage';
import Select from 'react-select';

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

export default function TreatmentTypeModal({ loggedInUser, BASE_URL, setIsChangingTreatmentType, treatmentTypeToUpdate, treatmentsToAdd, setIsUpdatingTreatmentType }) {
    // State variables for various data
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const navigate = useNavigate()
    const [open, setOpen] = useState(true);
    const [timeSlots, setTimeSlots] = useState(null)
    // add treatments type variables:
    const [daysToShow, setDaysToShow] = useState(null)
    const [selectedTreatment, setSelectedTreatment] = useState(null)
    const [selectedDays, setSelectedDays] = useState(null)
    const [selectedStartTime, setSelectedStartTime] = useState('')
    const [selectedEndTime, setSelectedEndTime] = useState('')

    useEffect(() => {
        if (treatmentTypeToUpdate) {
            setSelectedTreatment(treatmentTypeToUpdate.id)
            setSelectedStartTime(treatmentTypeToUpdate.patientAcceptStart)
            setSelectedEndTime(treatmentTypeToUpdate.patientAcceptEnd)
            const timeSlots = generateAppointmentSlots()
            setTimeSlots(timeSlots)
        }
    }, [])

    const handleClose = () => {
        if (treatmentTypeToUpdate) {
            setIsUpdatingTreatmentType(false)
        } else {
            setIsChangingTreatmentType(false)
        }
        setOpen(false)
    };

    function onSelectTreatment(selectedTreatment) {
        setTimeSlots(null)
        setSelectedTreatment(selectedTreatment)
        const timeSlots = generateAppointmentSlots()
        setTimeSlots(timeSlots)
        getDaysToShow(selectedTreatment)
    }

    function generateAppointmentSlots() {
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

    const getDaysToShow = async (selectedTreatment) => {
        const days = await fetchEmployeeDaysToAdd(selectedTreatment)
        const daysArr = days.map(day => day.day)
        const weekDaysAndVal = [
            { label: 'Sunday', value: 0 },
            { label: 'Monday', value: 1 },
            { label: 'Tuesday', value: 2 },
            { label: 'Wednesday', value: 3 },
            { label: 'Thursday', value: 4 },
            { label: 'Friday', value: 5 },
        ]
        const daysToShow = weekDaysAndVal.filter(day => !daysArr.includes(day.value))
        setDaysToShow(daysToShow)
    }

    const fetchEmployeeDaysToAdd = async (selectedTreatment) => {
        const employeeId = loggedInUser.id
        try {
            const response = await fetch(`${BASE_URL}/employee/employeeTreatmentDaysToAdd`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ employeeId, treatmentId: selectedTreatment })
            });
            const employeeDaysToAdd = await response.json();
            return employeeDaysToAdd
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const onSelectDays = (days) => {
        setSelectedDays(days)
    }

    const onSelectStartTime = (event) => {
        const treatmentTimeStart = event.target.value.substring(11, 16)
        setSelectedStartTime(treatmentTimeStart)
    }
    const onSelectEndTime = (event) => {
        const treatmentTimeEnd = event.target.value.substring(11, 16)
        setSelectedEndTime(treatmentTimeEnd)
    }

    const onAddTreatmentType = async () => {
        const selectedDaysIds = selectedDays.map(day => day.value)
        const treatmentTypeToAdd = {
            treatmentType: selectedTreatment,
            startTime: selectedStartTime,
            endTime: selectedEndTime,
            userId: loggedInUser.id,
            selectedDays: selectedDaysIds,
        }
        try {
            const response = await fetch(`${BASE_URL}/treatment/addEmployeeTreatmentType`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ treatmentTypeToAdd })
            });
            const treatmentType = await response.json();
            setIsSuccess(true)
            setUserMessage('Employee treatment type added')
            setTimeout(() => {
                window.location.href = '/treatments'
            }, 2000);
        } catch (error) {
            console.error(error);
            return [];
        }

    }

    const onUpdateTreatmentType = async () => {
        const treatmentTypeToUpdate = {
            treatmentType: selectedTreatment,
            startTime: selectedStartTime,
            endTime: selectedEndTime,
            userId: loggedInUser.id,
        }
        try {
            const response = await fetch(`${BASE_URL}/treatment/updateEmployeeTreatmentType`, {
                method: 'PUT',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ treatmentTypeToUpdate })
            });
            const treatmentType = await response.json();
            setIsSuccess(true)
            setUserMessage('Employee treatment type updated')
            setTimeout(() => {
                window.location.href = '/treatments'
            }, 2000);
        } catch (error) {
            console.error(error);
            return [];
        }

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
                    {treatmentTypeToUpdate ?
                        <section className="add-appointment-page">
                            <div className="add-appointment-container">
                                {/* Select treatment */}
                                <>
                                    <label htmlFor="treatmentType">Treatment to update</label>
                                    <span>{treatmentTypeToUpdate.treatmentType}</span>
                                </>
                                {!!timeSlots &&
                                    <>
                                        {/* Select start & end time */}
                                        <label htmlFor="slot">Select Start Time:</label>
                                        <select id="slot" onChange={onSelectStartTime}>
                                            <option value={treatmentTypeToUpdate.patientAcceptStart}>{treatmentTypeToUpdate.patientAcceptStart}</option>
                                            {timeSlots.map((time, index) => {
                                                return (
                                                    <option key={index} value={time.start}>
                                                        {time.start.substring(11, 16)}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                        <label htmlFor="slot">Select End TIme:</label>
                                        <select id="slot" onChange={onSelectEndTime}>
                                            <option value={treatmentTypeToUpdate.patientAcceptEnd}>{treatmentTypeToUpdate.patientAcceptEnd}</option>
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
                            </div>
                            {(selectedTreatment && selectedStartTime && selectedEndTime) &&
                                <>
                                    <button className="add-appointment-btn" style={{ width: "100%" }} onClick={onUpdateTreatmentType}>
                                        Update
                                    </button>
                                </>
                            }
                        </section>
                        :
                        <section className="add-appointment-page">
                            <div className="add-appointment-container">
                                {/* Select treatment */}
                                <>
                                    <label htmlFor="treatmentType">Select Treatment:</label>
                                    <select id='treatmentType' className="select-treatment" onChange={(event) => onSelectTreatment(event.target.value)}>
                                        <option value="">Select Treatment Type</option>
                                        {treatmentsToAdd &&
                                            treatmentsToAdd.map((treatment) => (
                                                <option key={treatment.id} value={treatment.id}>
                                                    {treatment.treatmentType}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </>
                                {!!timeSlots && selectedTreatment &&
                                    <>
                                        {/* Select days */}
                                        <Select
                                            isMulti={true}
                                            options={daysToShow}
                                            onChange={(selected) => onSelectDays(selected)}
                                            placeholder='Select days to set works hours:' />
                                        {/* Select start & end time */}
                                        <label htmlFor="timeStart">Select Start Time:</label>
                                        <select id="timeStart" onChange={onSelectStartTime}>
                                            <option value="">Select Start Time</option>
                                            {timeSlots.map((time, index) => {
                                                return (
                                                    <option key={index} value={time.start}>
                                                        {time.start.substring(11, 16)}
                                                    </option>
                                                )
                                            })
                                            }
                                        </select>
                                        <label htmlFor="timeEnd">Select End TIme:</label>
                                        <select id="timeEnd" onChange={onSelectEndTime}>
                                            <option value="">Select End TIme</option>
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
                            </div>
                            {(selectedTreatment && selectedStartTime && selectedEndTime && selectedDays) &&
                                <>
                                    <button className="add-appointment-btn" style={{ width: "100%" }} onClick={onAddTreatmentType}>
                                        Add
                                    </button>
                                </>
                            }
                        </section>
                    }
                </Box>
            </Modal>
            <UserMessage
                userMessage={userMessage}
                setUserMessage={setUserMessage}
                isSuccess={isSuccess}
                setIsSuccess={setIsSuccess}
            />
        </div >
    );
}
