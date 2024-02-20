import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import service from '../pages/service'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import PermissionToRender from '../components/Permission/PermissionToRender'
import { toast } from 'react-toastify'

function Home() {
	const navigate = useNavigate()
	const user = useSelector((state) => state.auth.user)
	const [users, setUsers] = useState([])

	const handleDelete = async (id) => {
		try {
			const response = await service.deleteUser(id)
			console.log(response)
			toast.success('User deleted successfully!')
		} catch (error) {
			console.error(error)
			toast.error('Error deleting user!')
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
						<Button
							disabled={
								JSON.parse(localStorage.getItem('role'))?.permissions?.includes(
									'USER_UPDATE'
								)
									? false
									: true
							}
							variant='contained'
							onClick={() => {
								navigate(`/edit-user/${params.row.id}`)
							}}>
							Edit
						</Button>
						<Button
							disabled={
								JSON.parse(localStorage.getItem('role'))?.permissions?.includes(
									'USER_DELETE'
								)
									? false
									: true
							}
							variant='contained'
							className='bg-red-500 text-white p-1 rounded-md'
							onClick={() => {
								handleDelete(params.row.id)
								window.location.reload()
							}}>
							Delete
						</Button>
						<Button
							disabled={
								JSON.parse(localStorage.getItem('role'))?.permissions?.includes(
									'USER_UPDATE'
								)
									? false
									: true
							}
							variant='contained'
							className='bg-black text-white p-1 rounded-md'
							onClick={() => {
								navigate(`/edit-user-roles`)
							}}>
							Edit Role
						</Button>
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
			<h1 className='text-xl font-bold m-3'>Welcome {user?.name}</h1>
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
			<div className='flex flex-col justify-center items-center w-full gap-2'>
				<PermissionToRender permissionCanView='USER_CREATE'>
					<div className='flex justify-center items-center bg-black text-white p-2 m-2  rounded-md'>
						ONLY USER_CREATE PERMISSION CAN SEE THIS CHILDREN
					</div>
				</PermissionToRender>
				<PermissionToRender permissionCanView='USER_DELETE'>
					<div className='flex justify-center items-center bg-black text-white p-2 m-2  rounded-md'>
						ONLY USER_DELETE PERMISSION CAN SEE THIS CHILDREN
					</div>
				</PermissionToRender>
				<PermissionToRender permissionCanView='USER_UPDATE'>
					<div className='flex justify-center items-center bg-black text-white p-2 m-2  rounded-md'>
						ONLY USER_UPDATE PERMISSION CAN SEE THIS CHILDREN
					</div>
				</PermissionToRender>
				<PermissionToRender permissionCanView='USER_READ'>
					<div className='flex justify-center items-center bg-black text-white p-2 m-2  rounded-md'>
						ONLY USER_READ PERMISSION CAN SEE THIS CHILDREN
					</div>
				</PermissionToRender>
				<PermissionToRender roleCanView='ROOT'>
					<div className='flex justify-center items-center bg-black text-white p-2 m-2 rounded-md '>
						ONLY ROOT ROLE CAN SEE THIS CHILDREN
					</div>
				</PermissionToRender>
				<PermissionToRender roleCanView='OBSERVER'>
					<div className='flex justify-center items-center bg-black text-white p-2 m-2  rounded-md'>
						ONLY OBSERVER ROLE CAN SEE THIS CHILDREN
					</div>
				</PermissionToRender>
			</div>
		</div>
	)
}

export default Home
