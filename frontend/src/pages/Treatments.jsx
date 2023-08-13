import { useEffect, useState } from "react"
import TreatmentTable from "../components/TreatmentTable";
import UserMessage from '../components/UserMessage';


export default function Treatments({ BASE_URL, loggedInUser }) {
    const [treatments, setTreatments] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const treatments = await getTreatments();
                console.log(`treatments:`, treatments)
                if (loggedInUser.isEmployee) {
                    const employeeTreatmentsTypes = await getEmployeeTreatmentsTypes()
                    console.log(`employeeTreatmentsTypes:`, employeeTreatmentsTypes)
                    const employeeTreatments = treatments.filter(treatment => {
                        return employeeTreatmentsTypes.includes(treatment.id)
                    })
                    console.log(`employeeTreatments:`, employeeTreatments)
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
            console.log(`employeeTreatments:`, employeeTreatments)
            // Extract the treatmentTypeIds from the first element in the array
            if (employeeTreatments.length) {
                return employeeTreatments[0].treatmentTypeIds.split(',');
            }
            return employeeTreatments;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function onRemoveTreatmentType(treatmentId) {
        console.log(`treatmentId:`, treatmentId)
        try {
            await fetch(`${BASE_URL}/treatment/removeTreatmentType`, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: loggedInUser.id,
                    treatmentId
                }) // Convert treatmentDetails to JSON and set as the request body

            });
            setIsSuccess(true)
            setUserMessage(`Treatment Type was removed!`);
            const employeeTreatments = treatments.filter(treatment => treatment.id !== treatmentId)
            setTreatments(employeeTreatments)

        } catch (error) {
            return setUserMessage(`Treatment Type Remove Failed!`);
        }
    }

    return (
        <section className="treatments-page">
            <h1 className="page-title">{loggedInUser.isEmployee ? `Employee's ` : 'All '} Treatments</h1>
            {treatments &&
                <TreatmentTable treatments={treatments} onRemoveTreatmentType={onRemoveTreatmentType} />
            }
            <UserMessage
                userMessage={userMessage}
                setUserMessage={setUserMessage}
                isSuccess={isSuccess}
                setIsSuccess={setIsSuccess}
            />
        </section>
    )
}
