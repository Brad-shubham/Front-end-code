import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export const PublicRoute = ({ component: Component, ...rest }) => {
    return(
        <Route 
            {...rest} 
            render = {(props) => {
                if (localStorage.getItem('token')) {
                    return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                }

                return <Component {...props} />
            }} 
        /> 
    );
}