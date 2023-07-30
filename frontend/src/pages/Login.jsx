import logoImg from '../assets/images/logo.png'
export default function Login({ setIsLoggedIn }) {
    const handleLogin = (event) => {
        event.preventDefault()
        setIsLoggedIn(true)
    }

    return (
        <section className="login-page">
            <div className="logo-container">
                <img src={logoImg} alt="Beauty Center logo" />
            </div>
            <form onSubmit={handleLogin}>
                <label>
                    Mail:
                    <input type="text" name="username" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <div className="resetPassword">
                    <button type="button" onClick={() => console.log('redirected to reset password')}>Reset Password</button>
                </div>
                <div className="login">
                    <button type="submit">Log In</button>
                </div>
                <div className="signup">
                    <button type="button" onClick={() => console.log('signing up')}>Signup</button>
                </div>
                <p className="message"></p>
            </form>
        </section>
    )
}
