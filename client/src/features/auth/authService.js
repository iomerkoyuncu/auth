import axios from "axios"

const API_URL = "http://localhost:3001/api/users"

// Register user
const register = async (userData) => {
	const response = await axios.post(API_URL + "/register", userData)

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data))
	}
	return response.data
}

// Login User
const login = async (userData) => {
	const response = await axios.post(API_URL + "/login", userData)

	if (response.data) {
		localStorage.setItem("user", JSON.stringify(response.data))
	}

	return response.data
}

// Logout user
const logout = () => {
	localStorage.removeItem("user")
	localStorage.removeItem("userRole")
}

// Get all the users
const getAllUsers = async () => {
	const response = await axios.get(API_URL + "/all")

	return response.data
}

// Add user 
const addUser = async (userData) => {
	const response = await axios.post(API_URL + "/", userData)

	return response.data
}

// Update user
const updateUser = async (id, userData) => {
	const response = await axios.put(API_URL + `/${id}`, userData)

	return response.data
}

// Delete user
const deleteUser = async (id) => {
	const response = await axios.delete(API_URL + `/${id}`)

	return response.data
}

// User Role 
const userRole = async (id) => {
	const response = await axios.get(API_URL + `/role/${id}`)
	return response.data
}


const authService = {
	register,
	logout,
	login,
	getAllUsers,
	addUser,
	updateUser,
	deleteUser,
	userRole
}

export default authService
