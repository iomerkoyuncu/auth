import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import { login, setUser } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import service from './service'
import { toast } from 'react-toastify'

function Register() {
	const dispatch = useDispatch()

	const [formdata, setFormdata] = useState({
		name: '',
		email: '',
		password: '',
	})
	const [loading, setLoading] = useState(false)

	const postRegister = async () => {
		setLoading(true)
		const response = await service.register(formdata)
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

	const handleRegister = (e) => {
		e.preventDefault()
		postRegister()
			.then((res) => {
				console.log(res)
				if (res.status === 201) {
					localStorage.setItem('token', res.data.token)
					localStorage.setItem(
						'user',
						JSON.stringify({
							id: res.data.id,
							name: res.data.name,
							email: res.data.email,
						})
					)

					dispatch(login(res.data)) // Pass user and permissions data to the login action
					dispatch(
						setUser({
							id: res.data.id,
							name: res.data.name,
							email: res.data.email,
						})
					) // Pass user data to the setUser action

					getRole(JSON.parse(localStorage.getItem('user')).id)

					toast.success('Registered successfully!')

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
				<h1 className='text-2xl font-bold'>Register</h1>
				<form onSubmit={handleRegister} className='flex flex-col p-2 m-2 gap-2'>
					<TextField
						id='name'
						label='Name'
						value={formdata.name}
						onChange={(e) => setFormdata({ ...formdata, name: e.target.value })}
						variant='outlined'
					/>
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
						Register
					</Button>

					<p className='mt-2'>
						Already have an account?{' '}
						<a href='/login' className='text-blue-500'>
							Log in
						</a>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Register
