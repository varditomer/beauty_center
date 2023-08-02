import { useState } from 'react';

export default function AddAppointment({ BASE_URL }) {

    const [selectedTreatment, setSelectedTreatment] = useState(null)
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    const treatments = [
        { id: '1', duration: 90, price: 200, treatmentType: 'makeup' },
        { id: '2', duration: 120, price: 500, treatmentType: 'laser' },
        { id: '3', duration: 30, price: 60, treatmentType: 'hair cut' },
        { id: '4', duration: 60, price: 150, treatmentType: 'hair spa' },
        { id: '5', duration: 40, price: 200, treatmentType: 'hairstyle' },
        { id: '6', duration: 150, price: 300, treatmentType: 'hair treatment' },
        { id: '7', duration: 120, price: 120, treatmentType: 'hair color' },
    ];

    const [selectedDay, setSelectedDay] = useState('');

    const onSelectDay = (event) => {
        setSelectedDay(event.target.value);
    };


    function onSelectTreatment(selectedTreatment) {
        console.log(`selectedTreatment:`, selectedTreatment)
        setSelectedTreatment(selectedTreatment)
    }
    function onSelectEmployee(selectedEmployee) {
        setSelectedEmployee(selectedEmployee)
    }

    return (
        <section className="add-appointment-page">
            <h1>Reserve New Treatment</h1>
            <>
                <label htmlFor="treatmentType">Select a Day:</label>
                <select id='treatmentType' onChange={(event) => onSelectTreatment(event.target.value)}>
                    <option value="">Select Treatment Type</option>
                    {treatments.map((treatment) => (
                        <option key={treatment.id} value={treatment.id}>
                            {treatment.treatmentType}
                        </option>
                    ))}
                </select>
            </>
            {selectedTreatment &&
                <>
                    <label htmlFor="weekday">Select a Day:</label>
                    <select id="weekday" value={selectedDay} onChange={onSelectDay}>
                        <option value="">Select a day</option>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                    </select>
                </>
            }

        </section>
    )
}


// treatment type
// employee
// date
