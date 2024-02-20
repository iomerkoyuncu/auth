import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import service from './service'
import { useDispatch } from 'react-redux'
import { login, setUser } from '../features/auth/authSlice'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'

function Login() {
	const dispatch = useDispatch()

	const [formdata, setFormdata] = useState({
		email: '',
		password: '',
	})
	const [loading, setLoading] = useState(false)
	const [users, setUsers] = useState([])

	const postLogin = async () => {
		setLoading(true)
		const response = await service.login(formdata)
		setLoading(false)
		return response
	}

	const getRole = async (id) => {
		const response = await service.getUserRole(id)
		response?.data
			? localStorage.setItem('role', JSON.stringify(response?.data))
			: localStorage.setItem('role', JSON.stringify({}))
	}

	const userData = localStorage.getItem('user')
	if (userData) {
		const parsedUserData = JSON.parse(userData)
		dispatch(setUser(parsedUserData))
	}

	const handleLogin = (e) => {
		e.preventDefault()
		postLogin()
			.then((res) => {
				if (res.status === 200) {
					localStorage.setItem('token', res.data.token)
					localStorage.setItem(
						'user',
						JSON.stringify({
							id: res.data.id,
							name: res.data.name,
							email: res.data.email,
						})
					)

					dispatch(login(res.data))
					dispatch(
						setUser({
							id: res.data.id,
							name: res.data.name,
							email: res.data.email,
						})
					)

					getRole(JSON.parse(localStorage.getItem('user')).id)

					toast.success('Logged in successfully!')

					window.location.href = '/'
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<div className='w-full h-screen flex justify-center items-center'>
			<div className='flex flex-col justify-center items-center shadow-2xl rounded-lg m-3 p-3 gap-3'>
				<h1 className='text-2xl font-bold'>Log in</h1>
				<form onSubmit={handleLogin} className='flex flex-col p-2 m-2 gap-2'>
					<TextField
						type='email'
						id='email'
						label='Email'
						value={formdata.email}
						onChange={(e) =>
							setFormdata({ ...formdata, email: e.target.value })
						}
						variant='outlined'
					/>
					<TextField
						type='password'
						id='password'
						label='Password'
						value={formdata.password}
						onChange={(e) =>
							setFormdata({ ...formdata, password: e.target.value })
						}
						variant='outlined'
					/>
					<Button type='submit' variant='contained' disabled={loading}>
						Log in
					</Button>

					<p>
						Don't have an account?{' '}
						<a href='/register' className='text-blue-500'>
							Register
						</a>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login
