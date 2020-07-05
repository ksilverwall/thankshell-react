import React from 'react'
import { Alert } from 'react-bootstrap'

const ErrorMessage = ({message}) =>  message && message.length ? (<Alert variant="danger">{message}</Alert>) : null;

export default ErrorMessage;
