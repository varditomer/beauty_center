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
    const [futureAppointments, setFutureAppointments] = useState([]);
    const [futureFilteredAppointments, setFutureFilteredAppointments] = useState([]);
    const [passAppointments, setPassAppointments] = useState([]);
    const [filteredPassAppointments, setFilteredPassAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [filteredCanceledAppointments, setFilteredCanceledAppointments] = useState(null);
    const [treatmentsTypeOptions, setTreatmentsTypeOptions] = useState(null);
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
                const canceledAppointments = isEmployee ? await fetchEmployeeCanceledAppointments() : []
                setCanceledAppointments(canceledAppointments)
                // Sort appointments by appointmentDateTime
                appointments.sort((a, b) => {
                    const dateA = new Date(a.appointmentDateTime);
                    const dateB = new Date(b.appointmentDateTime);
                    return dateA - dateB;
                });
                setAppointments(appointments)
                const appointmentByType = getAppointmentByType(appointments)
                setPassAppointments(appointmentByType.pastAppointments)
                setFutureAppointments(appointmentByType.futureAppointments);
                setAppointmentsByTypes(appointmentByType.pastAppointments, appointmentByType.futureAppointments, canceledAppointments)
            } catch (error) {
                console.error(error);
            }
        };

        getAppointments();
    }, []);


    useEffect(() => {
        // if (!appointments.length) return
        updateFilteredAppointments()
    }, [filterBy, futureAppointments]);


    const setAppointmentsByTypes = (pass, future, canceled) => {
        setFutureFilteredAppointments(future)
        setFilteredCanceledAppointments(canceled)
        setFilteredPassAppointments(pass)

    }

    const onFilterChanged = (filterName, selectedVal) => {

        let newFilterBy = { ...filterBy };
        newFilterBy[filterName] = selectedVal
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
            return treatmentsTypes;
        } catch (error) {
            console.error(error);
            return [];
        }
    }


    const updateFilteredAppointments = () => {
        let future = [...futureAppointments]
        let canceled = [...canceledAppointments]
        let pass = [...passAppointments]
        for (const filterName in filterBy) {
            switch (filterName) {
                case "treatment-type":
                    let treatmentTypes = filterBy[filterName].map(val => { return val.label });
                    if (treatmentTypes.length) {
                        future = future.filter(appointment => {
                            return treatmentTypes.includes(appointment.treatmentType)
                        });
                        canceled = canceled.filter(appointment => {
                            return treatmentTypes.includes(appointment.treatmentType)
                        });
                        pass = pass.filter(appointment => {
                            return treatmentTypes.includes(appointment.treatmentType)
                        });
                    }
                    break;
                case "price":
                    future = future.filter(appointment => {
                        return (+appointment.treatmentPrice) >= filterBy[filterName][0] && (+appointment.treatmentPrice) <= filterBy[filterName][1]
                    })
                    canceled = canceled.filter(appointment => {
                        return (+appointment.treatmentPrice) >= filterBy[filterName][0] && (+appointment.treatmentPrice) <= filterBy[filterName][1]
                    })
                    pass = pass.filter(appointment => {
                        return (+appointment.treatmentPrice) >= filterBy[filterName][0] && (+appointment.treatmentPrice) <= filterBy[filterName][1]
                    })
                    break;
                default:
                    break;
            }
        }
        setFutureFilteredAppointments(future)
        setFilteredCanceledAppointments(canceled)
        setFilteredPassAppointments(pass)
    }


    const removeAppoitment = (newAppointments, canceledAppointments) => {
        const newCanceledAppointments = [...canceledAppointments, canceledAppointments]
        setCanceledAppointments(newCanceledAppointments)
        setFutureAppointments(newAppointments)

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
            <Box >
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
            <div className="filter-container">
                <>
                    {treatmentsTypeOptions &&
                        <Select
                            key={filterBy}
                            isMulti={true}
                            isRtl={true}
                            options={treatmentsTypeOptions}
                            onChange={(value) => onFilterChanged('treatment-type', value)}
                            placeholder='Select Treaments' />
                    }
                </>
                <PriceSlider onFilterChanged={onFilterChanged} />

            </div>

            {/* Display page title */}

            {/* Link to add appointment page */}
            {!(loggedInUser.isEmployee) && <Link to='/addAppointment'>
                <button className="add-appointment-btn">Add Appointment</button>
            </Link>}

            <div className="appointment-section">
                {/* Display AppointmentTable component if appointments are available */}
                {!!futureFilteredAppointments.length && tableType === 0 &&
                    <>
                        <h1 className="page-title">{loggedInUser.isEmployee ? `Employee's ` : `Customer's `}Appointments</h1>
                        <AppointmentTable setAppointments={setFutureAppointments} BASE_URL={BASE_URL} appointments={futureFilteredAppointments} removeAppoitment={removeAppoitment} loggedInUser={loggedInUser} />
                    </>
                }
            </div>
            <div className="appointment-section">
                {/* Display AppointmentTable component if appointments are available */}
                {!!filteredPassAppointments.length && tableType === 1 &&
                    <>
                        <h1 className="page-title" style={{ marginBottom: "20px" }}>Past Appointments</h1>
                        <AppointmentTable isCanceledAppointment={true} setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={filteredPassAppointments} loggedInUser={loggedInUser} />
                    </>
                }
            </div>
            <div className="appointment-section">
                {/* Display AppointmentTable component if appointments are available */}
                {!!loggedInUser.isEmployee && filteredCanceledAppointments && tableType === 2 &&
                    <>
                        <h1 className="page-title" style={{ marginBottom: "20px" }}>Canceled Appointments</h1>
                        <AppointmentTable isCanceledAppointment={true} setAppointments={setFutureAppointments} BASE_URL={BASE_URL} appointments={filteredCanceledAppointments} loggedInUser={loggedInUser} />
                    </>
                }
            </div>

        </section>
    );
}
