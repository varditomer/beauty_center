import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ConstraintModal({ loggedInUser, BASE_URL, setIsAddingConstraint }) {
    const [open, setOpen] = useState(true);


    const handleClose = () => {
        setIsAddingConstraint(false)
        setOpen(false)
    };

    function onAddConstraint() {
        // Get input values using document.querySelector
        const date = document.querySelector('#date').value;
        const constraintStart = document.querySelector('#constraintStart').value;
        const constraintEnd = document.querySelector('#constraintEnd').value;
        const description = document.querySelector('#description').value;

        // Create an object to represent the constraint data
        const constraintData = {
            date: date,
            constraintStart: constraintStart,
            constraintEnd: constraintEnd,
            description: description
        };

        console.log(`constraintData:`, constraintData);

    }


    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <section className="add-appointment-page">
                        <div className="add-appointment-container">

                            <label for="date">Date:</label>
                            <input type="date" id="date" name="date" required />

                            <label for="constraintStart">Constraint Start Time:</label>
                            <input type="time" id="constraintStart" name="constraintStart" required />

                            <label for="constraintEnd">Constraint End Time:</label>
                            <input type="time" id="constraintEnd" name="constraintEnd" required />

                            <label for="description">Description:</label>
                            <textarea id="description" name="description" rows="4" cols="50" required></textarea>
                        </div>
                        <button className="add-appointment-btn" style={{ width: "100%" }} onClick={onAddConstraint}>
                            Add Constraint
                        </button>
                    </section>
                </Box>
            </Modal>
        </div >
    );
}
