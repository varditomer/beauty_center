import { useEffect, useState } from "react"

export default function Treatments({ BASE_URL }) {
    const [treatments, setTreatments] = useState(null)

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const treatments = await getTreatments();
                console.log(`treatments:`, treatments)
                setTreatments(treatments);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTreatments();
    }, []);

    const getTreatments = async () => {
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


    return (
        <section className="treatments-page">
        </section>
    )
}
