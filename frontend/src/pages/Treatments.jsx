import { useEffect, useState } from "react"
import TreatmentTable from "../components/TreatmentTable";

export default function Treatments({ BASE_URL, loggedInUser }) {
    const [treatments, setTreatments] = useState(null)

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const treatments = await getTreatments();
                if (loggedInUser.isEmployee) {
                    const employeeTreatmentsTypes = await getEmployeeTreatmentsTypes()
                    const employeeTreatments = treatments.filter(treatment => {
                        return employeeTreatmentsTypes.includes(treatment.id)
                    })
                    setTreatments(employeeTreatments);
                } else setTreatments(treatments);
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

    const getEmployeeTreatmentsTypes = async () => {
        try {
            const response = await fetch(`${BASE_URL}/treatment/employeeTreatments/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const employeeTreatments = await response.json();
            // Extract the treatmentTypeIds from the first element in the array
            const treatmentTypeIdsArray = employeeTreatments[0].treatmentTypeIds.split(',');
            return treatmentTypeIdsArray;
        } catch (error) {
            console.error(error);
            return [];
        }
    }


    return (
        <section className="treatments-page">
            <h1 className="page-title">{loggedInUser.isEmployee ? `Employee's ` : 'All '} Treatments</h1>
            {treatments &&
                <TreatmentTable treatments={treatments} />
            }
        </section>
    )
}
