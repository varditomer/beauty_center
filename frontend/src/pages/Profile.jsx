import { useState } from "react";
import UserMessage from "../components/UserMessage";
import { storageService } from "../services/storage.service";

export default function Profile({ loggedInUser , BASE_URL}) {

    const [userMessage, setUserMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [user, setUser] = useState(loggedInUser);

    const handleChange = (event) => {
        // event.preventDefault()
        console.log(event);
        if (event.target) {
            const { target } = event
            let field = target.name
            let value = target.value
            setUser({ ...user, [field]: value })
        }
    }

    // Function to handle the login/signup form submission
    const handleSubmit = async (event) => {
        event.preventDefault()
        // Extract email and password from the form
        const mail = event.target[0].value;
        const elMail = event.target[0];

        // Validate that email and password are provided
        if (!mail) {
            elMail.focus();
            return setUserMessage('Mail is required!');
        }


        // Validate the email format using the isValidMail function
        if (!isValidMail(mail)) {
            elMail.focus();
            return setUserMessage(`Mail isn't valid!`);
        }

        const name = event.target[1].value;
        const address = event.target[2].value;
        const phoneNumber = event.target[3].value;


        const userToUpdate = {
            mail,
            name,
            address,
            phoneNumber,
            id:loggedInUser.id
        };

        console.log(userToUpdate);
            const res = await updatePtofile(userToUpdate);
            if (res.error) { // Check for the "error" property instead of "status" to handle user already exists case
                elMail.focus();
                return setUserMessage('Email already exists!');
            } else {
                storageService.save('loggedInUser', {...loggedInUser,...userToUpdate});
                setUser({...loggedInUser,...userToUpdate});
                setUserMessage('User profile upadated')
                setIsSuccess(true)
                setTimeout(() => {
                    setUserMessage('')
                }, 3000);
                ;
            }

        // // Save the logged-in user in local storage and set the loggedInUser state
        // storageService.save('loggedInUser', user);
        // setLoggedInUser(user);
    }


    const updatePtofile = async (userToUpdate) => {
        const endpoint = "updateProfile"
        try {
            const response = await fetch(`${BASE_URL}/user/${endpoint}`, {
                method: 'PUT',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ userToUpdate })
            });
            const user = await response.json();
            return user;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

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

    console.log(user);
    return (
        <section className="profile-page">
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" onChange={handleChange} name="mail" value={user.mail} />
                </label>
                <label>
                    Name:
                    <input type="text" onChange={handleChange} name="name" value={user.name} required />
                </label>
                <label>
                    Address:
                    <input type="text" onChange={handleChange} name="address" value={user.address} required />
                </label>
                <label>
                    Phone Number:
                    <input type="tel" onChange={handleChange} name="phoneNumber" value={user.phoneNumber} pattern='^[0][5][05324789]{1}[0-9]{7}' />
                </label>
                <button className="login-signup" type="submit">Apply</button>
                {userMessage.length > 0 &&
                    <UserMessage
                        userMessage={userMessage}
                        setUserMessage={setUserMessage}
                        isSuccess={isSuccess}
                        setIsSuccess={setIsSuccess}
                    />
                }
            </form>
        </section>
        

    )

}