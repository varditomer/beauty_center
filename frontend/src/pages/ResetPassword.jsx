import { useState } from 'react';
import logoImg from '../assets/images/logo.png';
import UserMessage from '../components/UserMessage';
import { userService } from '../services/user.service';
import { useNavigate } from 'react-router-dom';



// Functional component for Login/Signup page
export default function ResetPassword({ BASE_URL }) {
    // State variables to manage the login/signup form
    const [isSuccess, setIsSuccess] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const navigate = useNavigate();

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

    const onResetPassword = async (event) => {
        event.preventDefault();

        // Extract email password and reset password code from the form
        const mail = event.target[0].value;
        const password = event.target[1].value;
        const confirmPassword = event.target[2].value;
        const resetPasswordCode = event.target[3].value;
        const elMail = event.target[0];
        const elPassword = event.target[1];
        const elConfirmPassword = event.target[2];
        const elResetPasswordCode = event.target[3];


        // Validate that email, password and reset password code are provided
        if (!mail) {
            elMail.focus();
            return setUserMessage('Mail is required!');
        }

        if (!password) {
            elPassword.focus();
            return setUserMessage('Password is required!');
        }

        if (!resetPasswordCode) {
            elResetPasswordCode.focus();
            return setUserMessage('Reset password code is required!');
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

        // Validate that the password and confirm password match
        if (password !== confirmPassword) {
            elConfirmPassword.focus();
            return setUserMessage(`Passwords don't match!`);
        }

        const resetPasswordDetails = {
            mail,
            password,
            resetPasswordCode
        }

        const res = await userService.resetPassword(resetPasswordDetails)
        if (res.error) { // Check for the "error" property instead of "status" to handle user already exists case
            elResetPasswordCode.focus();
            return setUserMessage(`Invalid Reset Password Code!`);
        } else {
            setIsSuccess(true)
            setUserMessage(`Password has changed!`);
            setTimeout(() => {
                navigate('/login');
            }, 2500); // 2000 milliseconds = 2 seconds
        }
    }

    // JSX content for the Login/Signup page
    return (
        <section className="login-signup-page">
            <h1>Reset Password</h1>
            <div className="form-container">

                <div className="logo-container">
                    <img src={logoImg} alt="Beauty Center logo" />
                </div>
                <form onSubmit={onResetPassword}>
                    <label>
                        Email:
                        <input type="email" name="mail" />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" />
                    </label>
                    <label>
                        Confirm Password:
                        <input type="password" name="confirmPassword" />
                    </label>
                    <label>
                        Reset Password Code:
                        <input type="text" name="name" />
                    </label>
                    <button className="login-signup" type="submit">Reset</button>
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

        </section >
    )
}
