import React from 'react'
import Loader from 'react-loader-spinner'

export default function SecondaryLoading() {
    return (
        <div className="row justify-content-center">
            <Loader type="Oval" color="#00BFFF" height={80} width={80} />
        </div>
    )
}
