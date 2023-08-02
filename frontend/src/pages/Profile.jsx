import { useState } from "react";
import UserMessage from "../components/UserMessage";

export default function Profile({ loggedInUser }) {

    const [userMessage, setUserMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const handleSubmit = () => {
        console.log('kaki');
    }
    console.log(loggedInUser);
    return (
        <section className="profile-page">
            <form onSubmit={handleSubmit}>
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