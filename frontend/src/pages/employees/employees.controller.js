// employees.controller.js
export const employeesController = {
  getPageStrHtml
}



function getPageStrHtml() {
  // This function generates the HTML content for the employees page.
  // You can customize the content as needed.
  const employeesContent = `
  <section class="employees-page">
    <div class="image-section">
        <div class="image-container">
            <img src="../../../assets/images/empl.png" alt="Image 1">
            <p class="caption">adel Jon... She works in manicure,
           <span class="text-highlight">pedicure</span> ,<span class="text-highlight">massage</span>, and <span class="text-highlight">makeup</span>.
            </p>
        </div>
        <div class="image-container">
            <img src="../../../assets/images/empl.png" alt="Image 2">
            <p>Teeny skyshe works in
            <span class="text-highlight"> 
            facial treatment </span>,
            <span class="text-highlight">makeup</span>
             ,and in 
             <span class="text-highlight">eyebrows
             </span>
             ,<span class="text-highlight">laser treatment
             </span>
             </p>
        </div>
        <div class="image-container">
            <img src="../../../assets/images/empl.png" alt="Image 3">
            <p>Paragraph 3</p>
        </div>
    </div>
  </section>
      `;

  return employeesContent;
}
