import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { login, signup } from '../Services/authService'; // Import the authentication service
import { useNavigate } from 'react-router-dom';
import { auth } from '../Config/firebaseConfig'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [admissionNo, setAdmissionNo] = useState(''); // State for admission number
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication

    const navigate = useNavigate();

    const toggleLogin = () => {
        setIsLogin(!isLogin);
        setError('');
        setAdmissionNo(''); // Reset admission number when toggling
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
                // Handle successful login (e.g., redirect to another page)
                console.log('User logged in successfully');
                alert('User logged in successfully');
                navigate('/');
            } else {
                await signup(email, password, admissionNo); // Pass admissionNo here
                // Handle successful signup (e.g., redirect to login or main page)
                console.log('User signed up successfully');
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
            console.error('Authentication Error:', err.message);
        }
    };
    

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                setIsAuthenticated(true);
            } else {
                // User is logged out
                setIsAuthenticated(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <Container className="min-vh-100 d-flex justify-content-center align-items-center">
            <Row className="w-100">
                {/* Left side: Image or Login Button based on auth state */}
                <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
                    <img
                        src="https://cdn.dribbble.com/users/2553116/screenshots/13792093/media/8b6205cc86585e2222843684ac739fb4.gif"
                        alt="Illustration"
                        className="img-fluid" // Bootstrap class to make the image responsive
                        style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'cover' }} // Ensure the image fits well
                    />
                </Col>

                {/* Right side: Form inside a Card */}
                <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
                    <Card className="p-4 w-100">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                <h2 className="fw-bold">BiteBOX</h2>
                            </Card.Title>
                            <Form onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Admission No"
                                            value={admissionNo}
                                            onChange={(e) => setAdmissionNo(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                {error && <p className="text-danger">{error}</p>}
                                <Button variant="dark" type="submit" className="w-100">
                                    {isLogin ? 'Login' : 'Sign Up'}
                                </Button>
                            </Form>
                            <p className="mt-4 text-center">
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <Button variant="link" onClick={toggleLogin}>
                                    {isLogin ? 'Sign Up' : 'Login'}
                                </Button>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
