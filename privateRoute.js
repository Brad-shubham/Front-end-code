import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export const PrivateRoute = ({ component: Component, ...rest }) => {
    return(
        <Route 
            {...rest} 
            render = {(props) => {
                if (!localStorage.getItem('token') && localStorage.getItem('token') == null) {
                    return <Redirect to={{ pathname: '/404', state: { from: props.location } }} />
                }

                return <Component {...props} />
            }} 
        /> 
    );
}