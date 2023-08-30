+------------------------+         +-------------------+
|       Treatments       |         |       Users       |
+------------------------+         +-------------------+
| id: varchar(9) [PK]   |         | id: varchar(5)   |
| duration: int(3)      |         | name: varchar(50)|
| price: double         |         | mail: varchar(50)|
| treatmentType: varchar|         | phoneNumber: varchar(10)|
+------------------------+         | address: varchar(50)   |
       | (0..*)                 (0..*)
       |
       |
       |
       |
       |
       |
       |
       | (0..*)
       |
+---------------------------+
| Employee_Treatments       |
+---------------------------+
| employeeId: varchar(9) [FK]|
| treatmentId: varchar(9) [FK]|
+---------------------------+
       | (1)                 (0..*)
       |
       |
       |
+---------------------------------------+
|    Employee_Available_Hours            |
+---------------------------------------+
| employeeId: varchar(9) [FK]            |
| treatmentId: varchar(9) [FK]           |
| day: int                              |
| patientAcceptStart: varchar(5)         |
| patientAcceptEnd: varchar(5)           |
+---------------------------------------+
       | (1)                        (0..*)
       |
+----------------------------------+
|       Employee_Constraints       |
+----------------------------------+
| id: INT [PK]                     |
| employeeId: varchar(9) [FK]      |
| date: varchar(10)                |
| constraintStart: varchar(5)      |
| constraintEnd: varchar(5)        |
| description: varchar(200)        |
+----------------------------------+
       | (0..*)
       |
+-------------------------+
|     Appointments        |
+-------------------------+
| id: INT [PK]            |
| appointmentDateTime: datetime|
| employeeId: varchar(9) [FK]|
| customerId: varchar(9) [FK]|
| treatmentId: varchar(9) [FK]|
+-------------------------+
       | (0..*)
       |
+-------------------------+
| Canceled_Appointments   |
+-------------------------+
| id: INT [PK]            |
| appointmentDateTime: datetime|
| employeeId: varchar(9) [FK]|
| customerId: varchar(9) [FK]|
| treatmentId: varchar(9) [FK]|
+-------------------------+
