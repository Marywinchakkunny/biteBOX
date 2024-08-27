import React, { useState, useEffect } from 'react';
import { Dropdown, Button } from 'react-bootstrap'; // Import Bootstrap Dropdown and Button components
import { auth } from '../Config/firebaseConfig'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth';
import { logout } from '../Services/authService'; // Import the logout function
import { useNavigate } from 'react-router-dom';

function Header() {
  // State to manage dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // State to track user authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get navigate function
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Check user authentication state
  useEffect(() => {
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

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      console.log('User logged out successfully');
      // Optionally, redirect to login page or perform other actions
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid mx-5">
        <a className="navbar-brand fw-bold" href="/">BiteBOX</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#">Cuisine</a>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link">Tickets</button>
            </li>
          </ul>

          <div className="d-flex align-items-center justify-content-end">
            {isAuthenticated ? (
              <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
                <Dropdown.Toggle
                  variant="link"
                  id="profile-dropdown"
                  className="p-0"
                  style={{ background: 'none', border: 'none' }}
                >
                  <img
                    src="https://cdnb.artstation.com/p/assets/images/images/023/658/431/large/javier-valdez-bee.jpg?1579911814"
                    className="rounded-circle me-2"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    alt="Profile"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" style={{ marginRight: '10px' }}>
                  <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button variant="dark" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
