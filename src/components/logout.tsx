import { Component } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { API_URL } from '../Constants';

export default class logout extends Component {
    render() {
        window.localStorage.removeItem('user');
        window.location.replace(`${API_URL}/oauth/logout`);
        return (
            <Container className="text-center">
                <Spinner animation="border" variant="warning" role="status" />
            </Container>
        );
    }
}
