import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

export default function TreatmentTable({ treatments, onRemoveTreatmentType, loggedInUser, setTreatmentTypeToUpdate, setIsUpdatingTreatmentType }) {

    const titles = loggedInUser.isEmployee ?  ['Duration', 'Price', 'Type', 'Start', 'End', ''] : ['Duration', 'Price', 'Type']
    const onEditTreatmentType = (treatmentTypeToUpdate) => {
        console.log(`treatmentTypeToUpdate:`, treatmentTypeToUpdate)
        setTreatmentTypeToUpdate(treatmentTypeToUpdate)
        setIsUpdatingTreatmentType(true)
    }
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
                        return <div key={treatment.id} className="row">
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
                                    <div className="cell capitalize" data-title={titles[2]}>
                                        {treatment.patientAcceptStart}
                                    </div>
                                    <div className="cell capitalize" data-title={titles[2]}>
                                        {treatment.patientAcceptEnd}
                                    </div>
                                    <div className="cell" style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                                        <div onClick={() => onRemoveTreatmentType(treatment.id)} title="Remove Treatment Type" className="remove-btn">
                                            <DeleteOutlineTwoToneIcon />
                                        </div>
                                        <div onClick={() => onEditTreatmentType(treatment)} title="Edit Treatment Type" className="remove-btn">
                                            <EditCalendarTwoToneIcon />
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

