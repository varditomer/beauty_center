import { useEffect, useState } from "react"
import TreatmentTable from "../components/TreatmentTable";
import UserMessage from '../components/UserMessage';
import TreatmentTypeModal from "../components/TreatmentTypeModal";


export default function Treatments({ BASE_URL, loggedInUser }) {
    const [treatments, setTreatments] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [isChangingTreatmentType, setIsChangingTreatmentType] = useState(null)

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const treatments = loggedInUser.isEmployee ? await getEmployeeTreatments() : await getTreatments();
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

    const getEmployeeTreatments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/treatment/employeeTreatments/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const employeeTreatments = await response.json();
            return employeeTreatments;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function onRemoveTreatmentType(treatmentId) {
        try {
            await fetch(`${BASE_URL}/treatment/removeTreatmentType`, {
                method: 'DELETE',
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
            <h1 className="page-title" style={loggedInUser.isEmployee ? {} : { marginBottom: '20px' }}>{loggedInUser.isEmployee ? `Employee's ` : 'All '} Treatments</h1>
            {isChangingTreatmentType &&
                <TreatmentTypeModal
                    loggedInUser={loggedInUser}
                    BASE_URL={BASE_URL}
                    setIsChangingTreatmentType={setIsChangingTreatmentType}
                    treatmentTypeToUpdate={null}
                    treatments={treatments}

                />
            }
            {!!loggedInUser.isEmployee &&
                <button className="add-appointment-btn" style={{ marginBottom: '16px' }} onClick={()=>setIsChangingTreatmentType(true)}>Add Treatment Type</button>
            }
            {treatments &&
                <TreatmentTable loggedInUser={loggedInUser} treatments={treatments} onRemoveTreatmentType={onRemoveTreatmentType} />
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
