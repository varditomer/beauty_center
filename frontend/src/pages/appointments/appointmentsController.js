// employees.controller.js
export const appointmentsController = {
    getPageStrHtml,
    getAppointments
}

// Getting appointments to show
function getAppointments() {
    fetch(`/appointment`, {
        method: "GET",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
        }
    })
        .then((val) => val.text())//we convert the data to text
        .then((val) => {
            console.log(`val:`, val)
            JSON.parse(val).forEach(element => {
                document.querySelector(".appointment-section").innerHTML +=
                    '<div style="display:flex;justify-content: space-between;">' +
                    `<div style="flex:1">${moment(element.date).format("DD/MM/YYYY")}</div>
               <div style="flex:1">${element.employeeID}</div>
               <div style="flex:1">${element.treatmentType}</div>
               <div style="flex:1">${element.startTime.substring(0, 5)}</div>
               <div style="flex:1">${element.endTime.substring(0, 5)}</div> 
               <div style="flex:1"><button onclick="deleteAppointment(${element.appointmentID})">Cancel</boutton></div>` +
                    '</div>';
            });
        })
        .catch((err) => console.error(err));
}


// inject treatments page strHtml content to dynamic content app section
function getPageStrHtml() {
    // This function generates the HTML content for the employees page.
    // You can customize the content as needed.
 
    const appointmentsContent = `
    <section class="appointment-page">
    <button class="add-appointment-btn">Add appointment</button>
    <div class="appointment-section">
        <div style="display:flex;justify-content: space-between;padding-bottom: 10px;color: blue;text-decoration: underline">
          <div style="flex:1">Date</div>
          <div style="flex:1">Employee</div>
          <div style="flex:1">Treatment</div>
          <div style="flex:1">Start Time</div>
          <div style="flex:1">End Time</div>
          <div style="flex:1">&nbsp;</div>
        </div>
    </div>
    </section>
        `
    return appointmentsContent;
}
