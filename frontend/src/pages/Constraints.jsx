import { useEffect, useState } from "react"
import TreatmentTable from "../components/TreatmentTable";
import UserMessage from '../components/UserMessage';
import TreatmentTypeModal from "../components/TreatmentTypeModal";
import ConstraintsTable from "../components/ConstraintsTable";
import ConstraintModal from "../components/ConstraintModal";


export default function Constraints({ BASE_URL, loggedInUser }) {
    const [treatments, setTreatments] = useState(null)
    const [treatmentsToAdd, setTreatmentsToAdd] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [isAddingConstraint, setIsAddingConstraint] = useState(null)
    const [isUpdatingConstraint, setIsUpdatingConstraint] = useState(false)
    const [treatmentTypeToUpdate, setTreatmentTypeToUpdate] = useState(null)

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const treatments = await getTreatments();
                if (loggedInUser.isEmployee) {
                    const employeeTreatments = await getEmployeeTreatments()
                    // Filter treatments that are not present in employeeTreatments
                    const newTreatments = treatments.filter(treatment => {
                        return employeeTreatments.filter(empTreatment => empTreatment.id === treatment.id).length < 6;
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

    async function onRemoveTreatmentType(treatmentId, day) {
        try {
            const allTreatmentsForType = treatments.filter(treatment => treatment.id === treatmentId)
            const isSingleTreatFromType = allTreatmentsForType.length > 1 ? false : true
            await fetch(`${BASE_URL}/treatment/removeTreatmentType`, {
                method: 'DELETE',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId: loggedInUser.id,
                    treatmentId,
                    day,
                    isSingleTreatFromType
                }) // Convert treatmentDetails to JSON and set as the request body

            });
            setIsSuccess(true)
            setUserMessage(`Treatment Type was removed!`);
            const newEmployeeTreatments = treatments.filter(treatment => (treatment.id !== treatmentId || treatment.day !== day))
            setTreatments(newEmployeeTreatments)
            const treatmentToRemove = treatments.find(treatment => treatment.id === treatmentId)
            if (isSingleTreatFromType || allTreatmentsForType.length === 6) setTreatmentsToAdd([...treatmentsToAdd, treatmentToRemove])
            setTimeout(() => {
                setUserMessage('')
            }, 2000);

        } catch (error) {
            return setUserMessage(`Treatment Type Remove Failed!`);
        }
    }

    return (
        <section className="treatments-page">
            <h1 className="page-title" style={{ marginBottom: '20px' }}>Employees Constraints</h1>
            {isAddingConstraint &&
                <ConstraintModal
                    loggedInUser={loggedInUser}
                    BASE_URL={BASE_URL}
                    setIsAddingConstraint={setIsAddingConstraint}
                    treatmentTypeToUpdate={null}
                    treatmentsToAdd={treatmentsToAdd}
                />
            }
            {isUpdatingConstraint &&
                <ConstraintModal
                    loggedInUser={loggedInUser}
                    BASE_URL={BASE_URL}
                    setIsUpdatingConstraint={setIsUpdatingConstraint}
                    treatmentTypeToUpdate={treatmentTypeToUpdate}
                />
            }
            <button className="add-appointment-btn" style={{ marginBottom: '16px' }} onClick={() => setIsAddingConstraint(true)}>Add Constraints</button>
            {treatments &&
                <ConstraintsTable setIsUpdatingTreatmentType={setIsUpdatingConstraint} setTreatmentTypeToUpdate={setTreatmentTypeToUpdate} loggedInUser={loggedInUser} treatments={treatments} onRemoveTreatmentType={onRemoveTreatmentType} />
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
