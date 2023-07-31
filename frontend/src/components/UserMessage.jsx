import { useState, useEffect } from 'react';

function UserMessage({ userMessage, setUserMessage, isSuccess, setIsSuccess }) {
    const [messageTimeout, setMessageTimeout] = useState(null);

    useEffect(() => {
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }

        const timeoutId = setTimeout(() => {
            clearMessage()
        }, 2500);

        setMessageTimeout(timeoutId);

        return () => {
            if (messageTimeout) {
                clearTimeout(messageTimeout);
            }
        };
    }, []);

    function clearMessage() {
        setUserMessage('');
        setIsSuccess(false);
    }

    return (
        <>
            {userMessage &&
                <h5 className={`user-msg ${isSuccess ? 'success' : 'warning'}`}>{userMessage}</h5>
            }
        </>
    );
}

export default UserMessage;
