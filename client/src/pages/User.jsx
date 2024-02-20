import React, { useState, useEffect } from 'react'
import service from './service'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

function User() {
	const { id } = useParams()
	const [loading, setLoading] = useState(false)
	const [user, setUser] = useState({})

	const getUser = async () => {
		setLoading(true)
		const response = await service.getUserById(id)
		setUser({
			name: response.data.name,
			email: response.data.email,
			...response.data,
		})
		setLoading(false)
		return response
	}

	useEffect(() => {
		getUser()
	}, [])

	const handleUpdate = (e) => {
		e.preventDefault()
		setLoading(true)
		service
			.updateUser(id, user)
			.then((res) => {
				console.log(res)
				setLoading(false)
				toast.success('User updated successfully!')
				window.location.href = '/'
			})
			.catch((err) => {
				console.log(err)
				setLoading(false)
			})
	}

	return (
		<div className='w-full h-screen flex justify-center items-center'>
			<div className='flex flex-col justify-center items-center shadow-2xl rounded-lg m-3 p-3 gap-3'>
				<h1 className='text-2xl font-bold'>Edit User</h1>
				<form onSubmit={handleUpdate} className='flex flex-col p-2 m-2 gap-2'>
					<TextField
						placeholder='Name'
						variant='outlined'
						value={user.name}
						onChange={(e) => setUser({ ...user, name: e.target.value })}
					/>
					<TextField
						type='email'
						placeholder='Email'
						variant='outlined'
						value={user.email}
						onChange={(e) => setUser({ ...user, email: e.target.value })}
					/>

					<Button type='submit' variant='contained' disabled={loading}>
						Edit User
					</Button>
				</form>
			</div>
		</div>
	)
}

export default User
