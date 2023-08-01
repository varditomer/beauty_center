import { Link } from 'react-router-dom'
import logoImg from '../assets/images/logo.png'
export default function Header() {
    return (
        <header className="header-container wrapper">
            <Link to='/'><img id="logo" src={logoImg} /></Link>
            <nav>
                <Link to='/employees'>Employees</Link>
                <Link to='/treatments'>Treatments</Link>
                <Link to='/appointments'>Appointments</Link>
                <Link to='/profile'><i className="fa-solid fa-user"></i></Link>
            </nav>
        </header>
    )
}
