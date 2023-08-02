// import employeeImg from '../assets/images/woman.png';
// import { useEffect, useState } from 'react';

// export default function Employees({ BASE_URL }) {

//     const [modifiedEmployees, setModifiedEmployees] = useState(null)

//     useEffect(() => {
//         const fetchTreatments = async () => {
//             try {
//                 const employees = await getEmployees();
//                 let modifiedEmployeesArray

//                 for (let i = 0; i < employees.length; i++) {
//                     const currEmployee = employees[i]
//                     for (let j = 0; j < modifiedEmployeesArray.length; j++) {
//                         const employeeId = modifiedEmployeesArray[j].id
//                     }
//                     modifiedEmployeesArray

//                 }
//                 console.log(`employees:`, employees)
//                 // setEmployees(employees);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchTreatments();
//     }, []);

//     const getEmployees = async () => {
//         try {
//             const response = await fetch(`${BASE_URL}/employee`, {
//                 method: 'GET',
//                 headers: {
//                     accept: 'application/json',
//                     'content-type': 'application/json',
//                 },
//             });
//             const employees = await response.json();
//             return employees;
//         } catch (error) {
//             console.error(error);
//             return [];
//         }
//     };


//     return (
//         <section className="employees-page">
//             {modifiedEmployees &&
//                 modifiedEmployees.map(employee => {
//                     return <article key={employee.id} className='employee-card'>
//                         <div className="img-container">
//                             <img src={employeeImg} alt="employee" className="img" />
//                         </div>
//                         <div className="details">
//                             <div className="name detail"><span className="title">Name:</span> {employee.name.toUpperCase()}</div>
//                             {/* <span className="email detail">Email: {employee.mail}</span> */}
//                             <div className="address detail"><span className="title">Address:</span> {employee.address}</div>
//                             <div className="treatment detail"><span className="title">Treatment:</span> {employee.treatmentType}</div>
//                         </div>
//                     </article>
//                 })
//             }

//         </section>
//     )
// }
