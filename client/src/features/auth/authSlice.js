import { createSlice } from '@reduxjs/toolkit';

// Check if user data is stored in local storage and initialize the state accordingly
const userData = localStorage.getItem('user');
const initialUserState = userData ? JSON.parse(userData) : null;
const initialPermissionsState = userData ? userData.permissions : [];

// Initial State
const initialState = {
	isLoggedIn: !!initialUserState,
	user: initialUserState,
	permissions: initialPermissionsState,
};

// Slice
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser(state, action) {
			state.user = action.payload;
			state.isLoggedIn = !!action.payload;
			state.permissions = action.payload ? action.payload.permissions : [];
		},
		login(state, action) {
			state.isLoggedIn = true;
			state.user = action.payload.user;
		},
		logout(state) {
			state.isLoggedIn = false;
			state.user = null;
			state.permissions = [];
		},
	},
});

// Action Creators
export const { login, logout, setUser } = authSlice.actions;

// Reducer
export default authSlice.reducer;