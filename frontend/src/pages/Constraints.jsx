import { useEffect, useState } from "react"
import UserMessage from '../components/UserMessage';
import ConstraintsTable from "../components/ConstraintsTable";
import ConstraintModal from "../components/ConstraintModal";


export default function Constraints({ BASE_URL, loggedInUser }) {
    const [constraints, setConstraints] = useState(null)
    const [isAddingConstraint, setIsAddingConstraint] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');

    useEffect(() => {
        const getEmployeeConstraints = async () => {
            try {
                const constraints = await fetchEmployeeConstraints();
                setConstraints(constraints);

            } catch (error) {
                console.error(error);
            }
        };

        getEmployeeConstraints();
    }, []);

    const fetchEmployeeConstraints = async () => {
        try {
            const response = await fetch(`${BASE_URL}/employee/employeeConstraints/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const employeeConstraints = await response.json();
            return employeeConstraints;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    async function onAddConstraint(constraintDetails) {
        try {
            await fetch(`${BASE_URL}/employee/addEmployeeConstraint`, {
                method: 'DELETE',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    ...constraintDetails,
                    employeeId: loggedInUser.id
                })

            });

            setIsSuccess(true)
            setUserMessage(`Constraint was added!`);
            setTimeout(() => {
                setUserMessage('')
            }, 2000);

        } catch (error) {
            return setUserMessage(`Constraint Added Failed!`);
        }
    }

    async function onRemoveConstraint(constraintId) {
        try {
            await fetch(`${BASE_URL}/employee/removeEmployeeConstraint`, {
                method: 'DELETE',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    constraintId
                })

            });

            setIsSuccess(true)
            setUserMessage(`Constraint was removed!`);
            const newConstraints = constraints.filter(constraint => constraint.id !== constraintId)
            setConstraints(newConstraints)
            setTimeout(() => {
                setUserMessage('')
            }, 2000);

        } catch (error) {
            return setUserMessage(`Constraint Remove Failed!`);
        }
    }

    return (
        <section className="treatments-page">
            <h1 className="page-title" style={{ marginBottom: '20px' }}>Employees Constraints</h1>
            {isAddingConstraint &&
                <ConstraintModal
                    onAddConstraint={onAddConstraint}
                    setIsAddingConstraint={setIsAddingConstraint}
                />
            }
            <button className="add-appointment-btn" style={{ marginBottom: '16px' }} onClick={() => setIsAddingConstraint(true)}>Add Constraints</button>
            {constraints?.length > 0 ?
                <ConstraintsTable constraints={constraints} onRemoveConstraint={onRemoveConstraint} />
                :
                <h2 style={{ color: "#d02fbd", fontWeight: "600", fontSize: "22px" }}>No Constraints yet!</h2>
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
