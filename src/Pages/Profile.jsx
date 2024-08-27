import React, { useState, useEffect } from 'react';
import { db, auth } from '../Config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Container, Row, Col, Card, Spinner, Form, Button } from 'react-bootstrap';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [roomNo, setRoomNo] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setRoomNo(data.roomNo || '');
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleRoomNoChange = (e) => {
    setRoomNo(e.target.value);
  };

  const handleSave = async () => {
    if (userData) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), { roomNo }, { merge: true });
        setUserData((prevData) => ({ ...prevData, roomNo }));
        setEditing(false);
      } catch (error) {
        console.error('Error updating room number:', error.message);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="text-center mt-5">
        <p>Please log in to see your profile information.</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center">
            <Card.Header>
              <h2>Profile</h2>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <Card.Img
                  variant="top"
                  src={userData.profilePictureUrl || 'https://cdnb.artstation.com/p/assets/images/images/023/658/431/large/javier-valdez-bee.jpg?1579911814'}
                  alt="Profile"
                  style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                />
              </div>
              <Card.Text>
                <strong>Email:</strong> {userData.email}
              </Card.Text>
              <Card.Text>
                <strong>Admission No:</strong> {userData.admissionNo}
              </Card.Text>
              <Card.Text>
                <strong>Room No:</strong>
                {editing ? (
                  <Form.Control
                    type="text"
                    value={roomNo}
                    onChange={handleRoomNoChange}
                    className="my-2 "
                  />
                ) : (
                  ` ${userData.roomNo || 'Not assigned'}`
                )}
              </Card.Text>
              <Card.Footer>
                {editing ? (
                  <Button variant="dark" onClick={handleSave}>Save</Button>
                ) : (
                  <Button variant="dark" onClick={handleEditToggle}>Edit Profile</Button>
                )}
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
