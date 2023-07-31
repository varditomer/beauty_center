export default function Table({ titles, data }) {
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

      {/* Table Rows */}
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className="cell" data-title={titles[cellIndex]}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

