import React from 'react'
import DataTable from '../components/DataTable'

export default props => {
    return (
        <div>
            {props.children || (<DataTable />)}
        </div>
    )
}