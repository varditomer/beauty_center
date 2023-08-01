import { useState } from 'react';

export default function AddAppointment({ BASE_URL }) {

    const [selectedTreatment, setSelectedTreatment] = useState(null)


    const treatments = [
        { id: '1', duration: 90, price: 200, treatmentType: 'makeup' },
        { id: '2', duration: 120, price: 500, treatmentType: 'laser' },
        { id: '3', duration: 30, price: 60, treatmentType: 'hair cut' },
        { id: '4', duration: 60, price: 150, treatmentType: 'hair spa' },
        { id: '5', duration: 40, price: 200, treatmentType: 'hairstyle' },
        { id: '6', duration: 150, price: 300, treatmentType: 'hair treatment' },
        { id: '7', duration: 120, price: 120, treatmentType: 'hair color' },
    ];

    function onSelectTreatment(selectedTreatment) {
        setSelectedTreatment()
    }

    return (
        <section className="add-appointment-page">
            <h1>Reserve New Treatment</h1>
            <select onChange={(event) => onSelectTreatment(event.target.value)}>
                <option value="">Select Treatment Type</option>
                {treatments.map((treatment) => (
                    <option key={treatment.id} value={treatment.id}>
                        {treatment.treatmentType}
                    </option>
                ))}
            </select>

        </section>
    )
}


// treatment type
// employee
// date
