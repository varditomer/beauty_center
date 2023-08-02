import { Link } from 'react-router-dom'
import logoImg from '../assets/images/logo.png'
import { storageService } from '../services/storage.service'
export default function Header({ loggedInUser, setLoggedInUser }) {
    function disconnect() {
        storageService.remove('loggedInUser')
        setLoggedInUser(null)
    }
    return (
        <header className="header-container wrapper">
            <Link to='/'><img id="logo" src={logoImg} /></Link>
            <nav>
                {!(loggedInUser.isEmployee) &&
                    <Link to='/employees'>Employees</Link>
                }
                <Link to='/treatments'>Treatments</Link>
                <Link to='/appointments'>Appointments</Link>
                {/* <Link to='/profile'><i className="fa-solid fa-user"></i></Link> */}
                <i className="fa-solid fa-sign-out signout" onClick={disconnect}></i>
            </nav>
        </header>
    )
}
