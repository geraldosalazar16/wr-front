import React from 'react'

export default function BranchRow({
	id,
	companyName,
	firstName,
	lastName,
	designation
}) {
    return (
		<tr>
			<td>{id}</td>
			<td>{companyName}</td>
			<td>{firstName}</td>
			<td>{lastName}</td>
			<td>{designation}</td>

			<td class="action_icons" align="center">
				<a href="branch-management-edit.html"><i class="fas fa-clipboard-list"></i> </a>
				<a href="#" class="red"><i class="fas fa-trash-alt"></i> </a>
				<a href="branch-management-edit.html"><i class="fas fa-eye"></i> </a>
			</td>
		</tr>
	)
}
