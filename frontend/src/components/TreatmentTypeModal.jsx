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

export default function TreatmentTypeModal({ loggedInUser, BASE_URL, setIsChangingTreatmentType, treatmentTypeToUpdate, treatments }) {
    // State variables for various data
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const navigate = useNavigate()
    const [open, setOpen] = useState(true);
    const [timeSlots, setTimeSlots] = useState(null)
    // add treatments type variables:
    const [selectedTreatment, setSelectedTreatment] = useState(null)
    const [selectedStartTime, setSelectedStartTime] = useState('')
    const [selectedEndTime, setSelectedEndTime] = useState('')


    const handleClose = () => {
        setIsChangingTreatmentType(false)
        setOpen(false)
    };
    function onSelectTreatment(selectedTreatment) {
        setTimeSlots(null)
        setSelectedTreatment(selectedTreatment)
        const timeSlots = generateAppointmentSlots()
        setTimeSlots(timeSlots)
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

    const onSelectStartTime = (event) => {
        const treatmentTimeStart = event.target.value.substring(11, 16)
        setSelectedStartTime(treatmentTimeStart)
    }
    const onSelectEndTime = (event) => {
        const treatmentTimeEnd = event.target.value.substring(11, 16)
        setSelectedEndTime(treatmentTimeEnd)
    }

    const onAddTreatmentType = async () => {
        const treatmentTypeToAdd = {
            treatmentType: selectedTreatment,
            startTime: selectedStartTime,
            endTime: selectedEndTime,
            userId: loggedInUser.id
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
                    <section className="add-appointment-page">
                        <div className="add-appointment-container">
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
                            {!!timeSlots &&
                                <>
                                    {/* Select start & end time */}
                                    <label htmlFor="slot">Select Start Time:</label>
                                    <select id="slot" onChange={onSelectStartTime}>
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
                                    <label htmlFor="slot">Select End TIme:</label>
                                    <select id="slot" onChange={onSelectEndTime}>
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
                        {(selectedTreatment && selectedStartTime && selectedEndTime) && 
                        <>
                            <button className="add-appointment-btn" style={{ width: "100%" }} onClick={onAddTreatmentType}>
                                Add
                            </button>
                        </>
                        }
                </section>
            </Box>
        </Modal>
        </div >
    );
}
