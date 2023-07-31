// Define the base URL for API requests
const BASE_URL = '//localhost:3001/api';

// Export an object containing functions for user-related operations
export const userService = {
    login,
    signup
};

// Function to perform a login request
function login(userCredentials) {
    // Send a POST request to the login endpoint with the provided user credentials
    return fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
            "accept": "application/json", 
            "content-type": "application/json",
        },
        body: JSON.stringify(userCredentials) // Convert userCredentials to JSON and set as the request body
    })
    .then((user) => user.json()) // Parse the JSON response received from the server
    .catch((err) => console.log(err)); // Handle any errors that occur during the login process
}

// Function to perform a user signup request
function signup(userToAdd) {
    // Send a POST request to the signup endpoint with the provided user data
    return fetch(`${BASE_URL}/user/signup`, {
        method: "POST",
        headers: {
            "accept": "application/json", 
            "content-type": "application/json",
        },
        body: JSON.stringify(userToAdd) // Convert userToAdd to JSON and set as the request body
    })
    .then((user) => user.json()) // Parse the JSON response received from the server
    .catch((err) => console.log(err)); // Handle any errors that occur during the signup process
}
