import { Component } from 'react';
import { Container } from 'react-bootstrap';
import { API_URL } from '../Constants';

export default class Login extends Component {
    render() {
        window.location.replace(`${API_URL}/oauth/login`);
        return <Container />;
    }
}
