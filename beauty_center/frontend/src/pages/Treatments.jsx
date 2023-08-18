import { useEffect, useState } from "react"
import TreatmentTable from "../components/TreatmentTable";
import UserMessage from '../components/UserMessage';
import TreatmentTypeModal from "../components/TreatmentTypeModal";


export default function Treatments({ BASE_URL, loggedInUser }) {
    const [treatments, setTreatments] = useState(null)
    const [treatmentsToAdd, setTreatmentsToAdd] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [isChangingTreatmentType, setIsChangingTreatmentType] = useState(null)
    const [isUpdatingTreatmentType, setIsUpdatingTreatmentType] = useState(false)
    const [treatmentTypeToUpdate, setTreatmentTypeToUpdate] = useState(null)

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const treatments = await getTreatments();
                if (loggedInUser.isEmployee) {
                    const employeeTreatments = await getEmployeeTreatments()
                    // Filter treatments that are not present in employeeTreatments
                    const newTreatments = treatments.filter(treatment => {
                        return !employeeTreatments.some(empTreatment => empTreatment.id === treatment.id);
                    });
                    setTreatments(employeeTreatments)
                    setTreatmentsToAdd(newTreatments)
                } else {
                    setTreatments(treatments);
                }
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
            const treatmentToRemove = treatments.find(treatment => treatment.id === treatmentId)
            const employeeTreatments = treatments.filter(treatment => treatment.id !== treatmentId)
            setTreatments(employeeTreatments)
            setTreatmentsToAdd([...treatmentsToAdd, treatmentToRemove])
            setTimeout(() => {
                setUserMessage('')
            }, 2000);

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
                    treatments={treatmentsToAdd}
                />
            }
            {isUpdatingTreatmentType &&
                <TreatmentTypeModal
                    loggedInUser={loggedInUser}
                    BASE_URL={BASE_URL}
                    setIsUpdatingTreatmentType={setIsUpdatingTreatmentType}
                    treatmentTypeToUpdate={treatmentTypeToUpdate}
                />
            }
            {!!loggedInUser.isEmployee &&
                <button className="add-appointment-btn" style={{ marginBottom: '16px' }} onClick={() => setIsChangingTreatmentType(true)}>Add Treatment Type</button>
            }
            {treatments &&
                <TreatmentTable setIsUpdatingTreatmentType={setIsUpdatingTreatmentType} setTreatmentTypeToUpdate={setTreatmentTypeToUpdate} loggedInUser={loggedInUser} treatments={treatments} onRemoveTreatmentType={onRemoveTreatmentType} />
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
