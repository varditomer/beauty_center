import { useState } from 'react'
import logoImg from '../assets/images/logo.png'
import UserMessage from '../components/UserMessage';
import { userService } from '../services/user.service';
import { storageService } from '../services/storage.service';

export default function Login({ setIsLoggedIn }) {
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)
    const [userMessage, setUserMessage] = useState('')

    const handleLoginSignup = async (event) => {
        event.preventDefault()

        let user

        const mail = event.target[0].value;
        const password = event.target[1].value;
        const elMail = event.target[0]
        const elPassword = event.target[1]

        if (!mail) {
            elMail.focus()
            return setUserMessage('Mail is required!')
        }

        if (!password) {
            elPassword.focus()
            return setUserMessage('Password is required!')
        }

        if (!isValidMail(mail)) {
            elMail.focus()
            return setUserMessage(`Mail isn't valid!`)
        }
        if (!(password.length >= 8)) {
            elPassword.focus()
            return setUserMessage('Password must be at least 8 Chars !')
        }

        if (isLoginMode) {
            const userCredentials = { mail, password }
            user = await userService.login(userCredentials)
        } else {
            const confirmPassword = event.target[2].value;
            const name = event.target[3].value;
            const address = event.target[4].value;
            const phoneNumber = event.target[5].value;

            const elConfirmPassword = event.target[2]

            if (password !== confirmPassword) {
                elConfirmPassword.focus()
                return setUserMessage(`Passwords don't match!`)
            }

            const userToAdd = {
                mail,
                password,
                name,
                address,
                phoneNumber,
            }
            const res = await userService.signup(userToAdd);
            if (res.error) { // Check for the "error" property instead of "status"
                elMail.focus();
                return setUserMessage('Email already exists!');
            } else {
                console.log('User registered successfully:', res);
                // ... (handle successful registration)
            }
        }

        storageService.save('loggedInUser', user)
        setIsLoggedIn(true)
    }


    function isValidMail(email) {
        // Check if the email contains the "@" symbol and at least one "." after the "@"

        // Find the index of the "@" symbol in the email address
        const atIndex = email.indexOf("@");

        // Find the index of the last "." in the email address
        const dotIndex = email.lastIndexOf(".");

        // The email address is considered valid if the following conditions are met:
        // 1. The "@" symbol is present and appears after the first character (index > 0).
        // 2. There is at least one "." after the "@" symbol (dotIndex > atIndex + 1).
        // 3. The last "." appears before the last character of the email (dotIndex < email.length - 1).
        return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
    }


    return (
        <section className="login-signup-page">
            <h1>{isLoginMode ? "Login" : "Sign-up"}</h1>
            <div className="form-container">

                <div className="logo-container">
                    <img src={logoImg} alt="Beauty Center logo" />
                </div>
                <form onSubmit={handleLoginSignup}>
                    <label>
                        Email:
                        <input type="email" name="mail" />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" />
                    </label>
                    {!isLoginMode &&
                        <>
                            <label>
                                Confirm Password:
                                <input type="password" name="confirmPassword" required />
                            </label>
                            <label>
                                Name:
                                <input type="text" name="name" required />
                            </label>
                            <label>
                                Address:
                                <input type="text" name="address" required />
                            </label>
                            <label>
                                Phone Number:
                                <input type="tel" name="phoneNumber" pattern='^[0][5][05324789]{1}[0-9]{7}' />
                            </label>
                        </>
                    }

                    {isLoginMode &&
                        <div className="reset-password">Forgot Password? <span onClick={() => console.log('reset password')} className='text-btn'>Reset by mail</span></div>
                    }
                    <button className="login-signup" type="submit">{isLoginMode ? "Login" : "Signup"}</button>
                    <div className="signup">{isLoginMode ? "Don't have an account?" : "Already sign up?"} <span onClick={() => setIsLoginMode(prev => !prev)} className="text-btn">{isLoginMode ? "Sign up" : "Login"}</span></div>
                    {userMessage.length > 0 &&
                        <UserMessage
                            userMessage={userMessage}
                            setUserMessage={setUserMessage}
                            isSuccess={isSuccess}
                            setIsSuccess={setIsSuccess}
                        />
                    }
                </form>
            </div>

        </section>
    )
}
