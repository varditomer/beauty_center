import { useEffect, useState } from 'react';
import AppointmentTable from '../components/AppointmentTable';
import Box from '@mui/material/Box';
import Select from 'react-select'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import RestoreIcon from '@mui/icons-material/Restore';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { Link } from 'react-router-dom';
import { PriceSlider } from '../components/PriceSlider';

export default function Appointments({ BASE_URL, loggedInUser }) {
    // State to hold appointments
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [passAppointments, setPassAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState(null);
    const [treatmentsTypeOptions, setTreatmentsTypeOptions] = useState(null);
    const [filteredreatmentsTypeOptions, setFilteredreatmentsTypeOptions] = useState(null);
    const [tableType, setTableType] = useState(0);
    const [filterBy, setFilterBy] = useState({});

    useEffect(() => {
        // Fetch and sort user appointments when component mounts
        (async () => {
            setTreatmentsTypeOptions(await getTreatmentTypes())
        })();
        const getAppointments = async () => {
            try {
                // Fetch user appointments
                const isEmployee = loggedInUser.isEmployee
                const appointments = isEmployee ? await fetchEmployeeAppointments() : await fetchCustomerAppointments();
                const canceledAppointments = isEmployee ? await fetchEmployeeCanceledAppointments() : null
                // Sort appointments by appointmentDateTime
                appointments.sort((a, b) => {
                    const dateA = new Date(a.appointmentDateTime);
                    const dateB = new Date(b.appointmentDateTime);
                    return dateA - dateB;
                });
                const appointmentByType = getAppointmentByType(appointments)
                setPassAppointments(appointmentByType.pastAppointments)
                setCanceledAppointments(canceledAppointments)
                // Update state with sorted appointments
                setAppointments(appointmentByType.futureAppointments);
            } catch (error) {
                console.error(error);
            }
        };

        getAppointments();
    }, []);
    

    useEffect(() => {
		// if (!appointments.length) return
		updateFilteredAppointments()
	}, [filterBy]);


	const onFilterChanged = (filterName, selectedVal) => {
       
		let newFilterBy = { ...filterBy };
        // console.log(newFilterBy);
		newFilterBy[filterName] = selectedVal
        // console.log(newFilterBy);
		setFilterBy(newFilterBy)
	};

    

    const getTreatmentTypes = async () => {
        try {
            const response = await fetch(`${BASE_URL}/treatment/`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            let treatmentsTypes = await response.json();
            treatmentsTypes = treatmentsTypes.map(treatmentsType => { return { value: treatmentsType.id, label: treatmentsType.treatmentType } })
            console.log(treatmentsTypes);
            return treatmentsTypes;
        } catch (error) {
            console.error(error);
            return [];
        }
    }


    const updateFilteredAppointments = () => {
        let currentAppointments = [...appointments]
        for (const filterName in filterBy) {
            switch (filterName) {
                case "treatment-type":
                    let treatmentTypes = filterBy[filterName].map(val => { return val.label });
                    console.log(!!treatmentTypes);
                    if (treatmentTypes.length) {
                        currentAppointments = currentAppointments.filter(appointment => {
                            return treatmentTypes.includes(appointment.treatmentType)
                        });
                    }
                    break;
                case "price":
                    currentAppointments = currentAppointments.filter(appointment => {
                        console.log(appointment.treatmentPrice);
                        return (+appointment.treatmentPrice) >= filterBy[filterName][0] && (+appointment.treatmentPrice) <= filterBy[filterName][1]
                    })
                    break;
                default:
                    break;
            }
        }
        setAppointments(currentAppointments);
    }


    // Function to fetch customer's appointments
    const fetchCustomerAppointments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const appointments = await response.json();
            return appointments;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // Function to fetch employee's appointments
    const fetchEmployeeAppointments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/employee/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const appointments = await response.json();
            return appointments;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const getAppointmentByType = (appointments) => {
        const currentDate = new Date();

        const pastAppointments = [];
        const futureAppointments = [];

        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.appointmentDateTime);
            if (appointmentDate < currentDate) {
                pastAppointments.push(appointment);
            } else {
                futureAppointments.push(appointment);
            }
        });
        console.log(passAppointments);
        console.log(futureAppointments);
        return { pastAppointments, futureAppointments }
    }

    const fetchEmployeeCanceledAppointments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/canceledAppointments/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const appointments = await response.json();
            return appointments;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    return (
        <section className="appointment-page">
            <PriceSlider onFilterChanged={onFilterChanged} />
            <>
                {treatmentsTypeOptions &&
                    <Select
                        key={filterBy}
                        isMulti={true}
                        isRtl={true}
                        options={treatmentsTypeOptions}
                        onChange={(value)=>onFilterChanged('treatment-type',value)}
                        placeholder='Select Treaments' />
                }
            </>
            <Box sx={{ width: 500 }}>
                <BottomNavigation
                    showLabels
                    value={tableType}
                    onChange={(event, newValue) => {
                        setTableType(newValue);
                    }}
                >
                    <BottomNavigationAction label="Upcoming" icon={<EventAvailableIcon />} />
                    <BottomNavigationAction label="History" icon={<RestoreIcon />} />
                    {!!loggedInUser.isEmployee &&
                        <BottomNavigationAction label="Canceled" icon={<DoNotDisturbAltIcon />} />
                    }
                </BottomNavigation>
            </Box>
            {/* Display page title */}

            {/* Link to add appointment page */}
            {!(loggedInUser.isEmployee) && <Link to='/addAppointment'>
                <button className="add-appointment-btn">Add Appointment</button>
            </Link>}

            <div className="appointment-section">
                {/* Display AppointmentTable component if appointments are available */}
                {!!appointments.length && tableType === 0 &&
                    <>
                        <h1 className="page-title">{loggedInUser.isEmployee ? `Employee's ` : `Customer's `}Appointments</h1>
                        <AppointmentTable setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={appointments} loggedInUser={loggedInUser} />
                    </>
                }
            </div>
            <div className="appointment-section">
                {/* Display AppointmentTable component if appointments are available */}
                {passAppointments && tableType === 1 &&
                    <>
                        <h1 className="page-title" style={{ marginBottom: "20px" }}>Past Appointments</h1>
                        <AppointmentTable isCanceledAppointment={true} setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={passAppointments} loggedInUser={loggedInUser} />
                    </>
                }
            </div>
            <div className="appointment-section">
                {/* Display AppointmentTable component if appointments are available */}
                {!!loggedInUser.isEmployee && canceledAppointments && tableType === 2 &&
                    <>
                        <h1 className="page-title" style={{ marginBottom: "20px" }}>Canceled Appointments</h1>
                        <AppointmentTable isCanceledAppointment={true} setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={canceledAppointments} loggedInUser={loggedInUser} />
                    </>
                }
            </div>

        </section>
    );
}
