import React from 'react'
const PermissionToRender = ({ permissionCanView, roleCanView, children }) => {
	const role = JSON.parse(localStorage.getItem('role'))?.role_id
	const permissions = JSON.parse(localStorage.getItem('role'))?.permissions

	const hasPermission = (requiredPermission) => {
		return permissions?.includes(requiredPermission)
	}

	const hasRole = (reqRole) => {
		return role === reqRole
	}

	const renderChildren = () => {
		if (
			(permissionCanView && !hasPermission(permissionCanView)) ||
			(roleCanView && !hasRole(roleCanView)) ||
			false
		) {
			return null
		}
		return children
	}

	return <>{renderChildren()}</>
}

export default PermissionToRender
