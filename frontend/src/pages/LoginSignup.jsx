import { useState } from 'react';
import logoImg from '../assets/images/logo.png';
import UserMessage from '../components/UserMessage';
import { userService } from '../services/user.service';
import { storageService } from '../services/storage.service';

// Functional component for Login/Signup page
export default function LoginSignup({ setLoggedInUser }) {
    // State variables to manage the login/signup form
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false)
    const [resetPasswordEmail, setResetPasswordEmail] = useState('')

    // Function to handle the login/signup form submission
    const handleLoginSignup = async (event) => {
        event.preventDefault();

        let user;

        // Extract email and password from the form
        const mail = event.target[0].value;
        const password = event.target[1].value;
        const elMail = event.target[0];
        const elPassword = event.target[1];

        // Validate that email and password are provided
        if (!mail) {
            elMail.focus();
            return setUserMessage('Mail is required!');
        }

        if (!password) {
            elPassword.focus();
            return setUserMessage('Password is required!');
        }

        // Validate the email format using the isValidMail function
        if (!isValidMail(mail)) {
            elMail.focus();
            return setUserMessage(`Mail isn't valid!`);
        }

        // Validate that the password is at least 8 characters long
        if (!(password.length >= 8)) {
            elPassword.focus();
            return setUserMessage('Password must be at least 8 characters!');
        }

        // If in login mode, call the userService.login() to authenticate the user
        if (isLoginMode) {
            const userCredentials = { mail, password };
            const res = await userService.login(userCredentials);
            if (res.error) { // Check for the "error" property instead of "status" to handle user already exists case
                return setUserMessage('Invalid Password or Email!');
            } else {
                user = res
            }

        } else { // If in signup mode, create a new user object and call the userService.signup()
            const confirmPassword = event.target[2].value;
            const name = event.target[3].value;
            const address = event.target[4].value;
            const phoneNumber = event.target[5].value;
            const elConfirmPassword = event.target[2];

            // Validate that the password and confirm password match
            if (password !== confirmPassword) {
                elConfirmPassword.focus();
                return setUserMessage(`Passwords don't match!`);
            }

            const userToAdd = {
                mail,
                password,
                name,
                address,
                phoneNumber,
            };

            // Call the userService.signup() to register the new user
            const res = await userService.signup(userToAdd);
            if (res.error) { // Check for the "error" property instead of "status" to handle user already exists case
                elMail.focus();
                return setUserMessage('Email already exists!');
            } else {
                user = res;
            }
        }

        // Save the logged-in user in local storage and set the loggedInUser state
        storageService.save('loggedInUser', user);
        setLoggedInUser(user);
    }

    // Function to validate the email format
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

    async function onResetPassword() {
        const res = await userService.initiateResetPassword(resetPasswordEmail)
        const elEmail = document.querySelector('.mail')
        if (res.error) { // Check for the "error" property instead of "status" to handle user already exists case
            elEmail.focus();
            return setUserMessage(`Email doesn't exists!`);
        } else {
            setIsSuccess(true)
            setUserMessage(`Reset Password Emailed!`);
        }
    }

    // JSX content for the Login/Signup page
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
                        <input type="email" name="mail" className='mail' />
                    </label>
                    {isForgotPasswordMode &&
                        <>
                            <span onClick={() => setIsForgotPasswordMode(false)} className='text-btn'>Close</span>
                            <button disabled={!isValidMail(resetPasswordEmail)} type='button' onClick={onResetPassword}>Send</button>
                        </>
                    }
                    {!isForgotPasswordMode &&
                        <label>
                            Password:
                            <input type="password" name="password" />
                        </label>
                    }

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
                        <>
                            {!isForgotPasswordMode &&
                                <div className="reset-password">Forgot Password? <span onClick={() => setIsForgotPasswordMode(true)} className='text-btn'>Reset by mail</span></div>
                            }
                        </>

                    }
                    {!isForgotPasswordMode &&
                        <>
                            <button className="login-signup" type="submit">{isLoginMode ? "Login" : "Signup"}</button>
                            <div className="signup">{isLoginMode ? "Don't have an account?" : "Already sign up?"} <span onClick={() => setIsLoginMode(prev => !prev)} className="text-btn">{isLoginMode ? "Sign up" : "Login"}</span></div>
                        </>
                    }
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
