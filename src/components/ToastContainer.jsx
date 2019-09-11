import React from 'react'
import { DefaultToastContainer } from 'react-toast-notifications'

const ToastContainer = props => (
	<DefaultToastContainer {...props} style={{ zIndex: 9999 }} />
)

export default ToastContainer
