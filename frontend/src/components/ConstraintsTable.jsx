import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

export default function ConstraintsTable({ treatments, onRemoveTreatmentType, loggedInUser, setTreatmentTypeToUpdate, setIsUpdatingTreatmentType }) {

    const titles = loggedInUser.isEmployee ? ['Duration', 'Price', 'Type', 'Day', 'Start', 'End', ''] : ['Duration', 'Price', 'Type']

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <>
            <div className="custom-table">
                {/* Table Header */}
                <div className="row header">
                    {titles.map((title) => (
                        <div key={title} className="cell">
                            {title}
                        </div>
                    ))}
                </div>
                {!!treatments.length &&
                    treatments.map(treatment => {
                        return <div key={loggedInUser.isEmployee ? `${treatment.day}-${treatment.id}` : treatment.id} className="row">
                            <div className="cell" data-title={titles[0]}>
                                {treatment.duration} min
                            </div>
                            <div className="cell" data-title={titles[1]}>
                                {treatment.price}₪
                            </div>
                            <div className="cell capitalize" data-title={titles[2]}>
                                {treatment.treatmentType}
                            </div>
                            {!!loggedInUser.isEmployee &&
                                <>
                                    <div className="cell capitalize" data-title={titles[3]}>
                                        {daysOfWeek[treatment.day]}
                                    </div>
                                    <div className="cell capitalize" data-title={titles[4]}>
                                        {treatment.patientAcceptStart}
                                    </div>
                                    <div className="cell capitalize" data-title={titles[5]}>
                                        {treatment.patientAcceptEnd}
                                    </div>
                                    <div className="cell" style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                                        <div onClick={() => onRemoveTreatmentType(treatment.id, treatment.day)} title="Remove Treatment Type" className="remove-btn">
                                            <DeleteOutlineTwoToneIcon />
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    })}
            </div>

        </>
    )
}

