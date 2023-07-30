// homeController.js
export const homeController = {
  getPageStrHtml
}

function getPageStrHtml() {
  // This function generates the HTML content for the home page.
  // You can customize the content as needed.
  const homeContent = `
  <section class="home-page">
<p> 
Welcome to our beauty center!

We offer a wide range of beauty and skincare services, including skincare, makeup, hair styling and coloring,

nail care, hair removal, massage, body care, and more.

You can easily book an appointment through our reliable website.

We look forward to welcoming you and providing you with exceptional

beauty services. Thank you for choosing our beauty center,

and we are ready to meet your beauty care needs and desires!
</p>
      <div class="image-container">
        <figure>
            <a href="/employees"><img src="./assets/images/employee.png" alt="Employees"></a>
            <figcaption>Employees</figcaption>
        </figure>
        <figure>
            <a href="/treatments"><img src="./assets/images/serves.png" alt="servers"></a>
            <figcaption>Treatments</figcaption>
        </figure>
        <figure>
            <a href="/appointment"><img src="./assets/images/appointment.png" alt="appointment"></a>
            <figcaption> appointment</figcaption>
        </figure>
      </div>
      <section>
    `;

  return homeContent;
}
