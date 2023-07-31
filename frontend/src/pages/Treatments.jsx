import { useEffect, useState } from "react"

export default function Treatments({ BASE_URL }) {
    const [treatments, setTreatments] = useState(null)

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const treatments = await getTreatments();
                const treatmentsArr = objectsToArrayOfArrays(treatments)
                console.log(`treatmentsArr:`, treatmentsArr)

                setTreatments(treatments);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTreatments();
    }, []);

    function objectsToArrayOfArrays(objectsArray) {
        return objectsArray.map((obj) => Object.values(obj));
    }

    const getTreatments = async () => {
        try {
            console.log(`${BASE_URL}/treatment:`, `${BASE_URL}/treatment`)
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


    return (
        <section className="treatments-page">
        </section>
    )
}
