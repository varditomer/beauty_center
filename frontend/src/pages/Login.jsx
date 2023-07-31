import { useState } from 'react'
import logoImg from '../assets/images/logo.png'
export default function Login({ setIsLoggedIn }) {
    const handleLogin = (event) => {
        event.preventDefault()
        setIsLoggedIn(true)
    }

    const [isLoginMode, setIsLoginMode] = useState(true)

    return (
        <section className="login-page">
            <h1>{isLoginMode?"Login":"Sign-up"}</h1>
            <div className="form-container">

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

                <div className="reset-password" onClick={() => console.log('redirected to reset password')}>Reset Password</div>
                <button className="login" type="submit">Log In</button>
                <div className="signup">{isLoginMode?"Don't have an account?":"Already sign up?"} <span onClick={() => console.log('signing up')} className="signup-login-btn">{isLoginMode?"Sign up":"Login"}</span></div>
                <p className="message"></p>
            </form>
            </div>

        </section>
    )
}
