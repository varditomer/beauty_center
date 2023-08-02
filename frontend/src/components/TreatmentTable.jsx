export default function TreatmentTable({ treatments }) {

    const titles = ['Duration', 'Price', 'Type']

    return (
        <>
            {treatments &&
                <div className="custom-table">
                    {/* Table Header */}
                    <div className="row header">
                        {titles.map((title) => (
                            <div key={title} className="cell">
                                {title}
                            </div>
                        ))}
                    </div>
                    {/* Table Rows */}
                    {treatments.map(treatment => {
                        return <div key={treatment.id} className="row">
                            <div className="cell" data-title={titles[0]}>
                                {treatment.duration} min
                            </div>
                            <div className="cell" data-title={titles[1]}>
                                {treatment.price}₪
                            </div>
                            <div className="cell" data-title={titles[2]}>
                                {treatment.treatmentType}
                            </div>
                        </div>
                    })}
                </div>
            }
        </>
    )
}

