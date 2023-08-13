export default function TreatmentTable({ treatments, onRemoveTreatmentType, loggedInUser }) {

    const titles = ['Duration', 'Price', 'Type', 'Start', 'End', '']
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
                            {!!loggedInUser.isEmp &&
                                <>
                                    <div className="cell capitalize" data-title={titles[2]}>
                                        14:00
                                    </div>
                                    <div className="cell capitalize" data-title={titles[2]}>
                                        19:00
                                    </div>
                                    <div className="cell" style={{ justifyContent: "center", alignItems: "center" }}>
                                        <div onClick={() => onRemoveTreatmentType(treatment.id)} title="Remove-Treatment" className="remove-btn">X</div>
                                    </div>
                                </>
                            }
                        </div>
                    })}
            </div>

        </>
    )
}

