import React from 'react'
import BranchRow from './BranchRow'

export default function BranchList({ branchs }) {
    return (
        <table className="table table-bordered" cellSpacing="0" cellPadding="0" align="left">
            <thead>
                <tr>
                    <th width="15%">Branch ID</th>
                    <th width="15%">Company Name</th>
                    <th width="20%">First Name</th>
                    <th width="15%">Last Name</th>
                    <th width="15%">Designation</th>
                    <th width="20%"></th>
                </tr>
            </thead>
            <tbody>
                {branchs && branchs.map(branch => {
                    return <BranchRow branch={branch} />
                })}
            </tbody>
        </table>
    )
}
