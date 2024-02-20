import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import service from '../pages/service'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function EditUserRoles() {
	const navigate = useNavigate()
	const user = useSelector((state) => state.auth.user)
	const [users, setUsers] = useState([])

	const getRole = async (id) => {
		const response = await service.getUserRole(id)
		response?.data
			? localStorage.setItem('role', JSON.stringify(response?.data))
			: localStorage.setItem('role', JSON.stringify({}))
	}

	const giveRootAccess = async (id) => {
		try {
			const response = await service.giveRootAccess(id)
			console.log(response)
			toast.success('Root access granted successfully!')
			getRole(id)
		} catch (error) {
			console.error(error)
			toast.error('Error granting root access!')
		}
	}

	const giveObserverAccess = async (id) => {
		try {
			const response = await service.giveObserverAccess(id)
			console.log(response)
			toast.success('Observer access granted successfully!')
			getRole(id)
		} catch (error) {
			console.error(error)
			toast.error('Error granting observer access!')
		}
	}

	const columns = [
		{ field: 'id', headerName: 'ID', width: 90 },
		{
			field: 'name',
			headerName: 'Name',
			width: 150,
		},
		{
			field: 'email',
			headerName: 'Email',
			width: 150,
		},
		{
			field: 'actions',
			headerName: 'Actions',
			width: 300,
			renderCell: (params) => {
				return (
					<div className='flex justify-center items-center gap-2'>
						<button
							className='bg-black text-white p-1 rounded-md'
							onClick={() => {
								giveRootAccess(params.row.id)
							}}>
							Give Root Access
						</button>

						<button
							className='bg-black text-white p-1 rounded-md'
							onClick={() => {
								giveObserverAccess(params.row.id)
							}}>
							Give Observer Access
						</button>
					</div>
				)
			},
		},
	]

	const getUsers = async () => {
		const response = await service.getAllUsers()
		setUsers(response.data)
		return response
	}

	useEffect(() => {
		getUsers()
	}, [])

	return (
		<div className='font-bold w-full flex flex-col justify-center items-center p-2 m-2 gap-2'>
			<h1 className='text-xl font-bold m-3'>Edit User Roles</h1>
			<div className='w-[700px]'>
				<DataGrid
					rows={users}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 5,
							},
						},
					}}
					men
					pageSizeOptions={[5]}
					disableRowSelectionOnClick
				/>
			</div>
		</div>
	)
}

export default EditUserRoles
