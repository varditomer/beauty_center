import { useEffect, useState } from "react";

export default function Table({ titles, data }) {
  
  const [newData, setNewData] = useState(null)
  
  useEffect(() => {
    const newData = data.map((obj) => {
      delete obj.id
      return Object.values(obj)
    })
    setNewData(newData)
  }, []);

  console.log('data2', newData);
  
  return (
    <>
      {newData &&
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
          {newData.map((row, idx) => {
            return <div key={idx} className="row">
              {row.map((cell, idx) => {
                return <div key={idx} className="cell" data-title={titles[idx]}>
                  {cell}
                </div>
              })}
            </div>
          })}
        </div>
      }
    </>
  )
}

