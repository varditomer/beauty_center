// employees.controller.js
export const treatmentsController = {
  getPageStrHtml,
  getTreatments
}

// Getting treatments to show
function getTreatments() {
  fetch("/treatment", {
    method: "GET",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
    },
  })
    .then((val) => val.text())//we convert the data to text
    .then((val) => {
      JSON.parse(val).forEach(element => {
        document.querySelector(".treat-section").innerHTML +=
          `<div style="display:flex;justify-content: space-between;">
           <div style="flex: 1;"><img height=50 src="./assets/images/serves.png" alt="Image 1"></div>
           <div style="flex: 1;">${element.treatmentType}</div>
           <div style="flex: 1;">${element.time}</div>
           <div style="flex: 1;">${element.price}</div>
        </div>`;
      });

    })
    .catch((err) => console.log(err));
}


// inject treatments page strHtml content to dynamic content app section
function getPageStrHtml() {
  // This function generates the HTML content for the employees page.
  // You can customize the content as needed.
  const treatmentsContent = `
  <section class="treatments-page">
    <div class="treat-section">
    <div style="display:flex;justify-content: space-between;padding-bottom: 10px;color: blue;text-decoration: underline">
      <div style="flex: 1;">&nbsp;</div>
      <div style="flex: 1;">Treatment type</div>
      <div style="flex: 1;">Time</div>
      <div style="flex: 1;">Price</div>
    </div>
    </div>
  </section>
      `;

  return treatmentsContent;
}
