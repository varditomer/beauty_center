import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

export default function ConstraintsTable({ constraints, onRemoveConstraint }) {

    const titles = ['Date', 'Day', 'Start', 'End', 'Description', '']

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const getWeekDay = (formattedDate) => {
        const date = new Date(formattedDate)
        const dayId = date.getDay()
        const day = daysOfWeek[dayId]
        return day
    }

    return (
        <div className="custom-table">
            {/* Table Header */}
            <div className="row header">
                {titles.map((title) => (
                    <div key={title} className="cell">
                        {title}
                    </div>
                ))}
            </div>
            {!!constraints.length &&
                constraints.map(constraint => {
                    return <div key={`${constraint.employeeId}-${constraint.date}`} className="row">
                        <div className="cell" data-title={titles[0]}>
                            {constraint.date}
                        </div>
                        <div className="cell" data-title={titles[1]}>
                            {getWeekDay(constraint.date)}
                        </div>
                        <div className="cell capitalize" data-title={titles[3]}>
                            {constraint.constraintStart}
                        </div>
                        <div className="cell capitalize" data-title={titles[4]}>
                            {constraint.constraintEnd}
                        </div>
                        <div className="cell capitalize" data-title={titles[5]}>
                            {constraint.description}
                        </div>
                        <div className="cell" style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                            <div onClick={() => onRemoveConstraint(constraint.id)} title="Remove Constraint" className="remove-btn">
                                <DeleteOutlineTwoToneIcon />
                            </div>
                        </div>
                    </div>
                })
            }
        </div >

    )
}

