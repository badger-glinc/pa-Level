// PaLevel - Student Accommodation App (Fullstack)
// Author: Goronga Charles Makuwerere

// === FILE: server.js ===
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Welcome to PaLevel API!' });
});

// Dummy listings
let listings = [];

app.post('/api/listings', (req, res) => {
  const { name, location, price, contact } = req.body;
  if (!name || !location || !price || !contact) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const newListing = { id: Date.now(), name, location, price, contact };
  listings.push(newListing);
  res.status(201).json(newListing);
});

app.get('/api/listings', (req, res) => {
  res.json(listings);
});

// Quick test page route
app.get('/test', (req, res) => {
  res.send('<h1>🚀 PaLevel Backend Running</h1>');
});

// Serve React frontend from build
const frontendBuildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 PaLevel backend running on port ${PORT}`));


/* === FILE: frontend/src/App.js === */
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', price: '', contact: '' });

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Failed to connect to backend.'));

    fetch('/api/listings')
      .then(res => res.json())
      .then(data => setListings(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(res => res.json())
    .then(newListing => {
      setListings([...listings, newListing]);
      setForm({ name: '', location: '', price: '', contact: '' });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏠 PaLevel</h1>
        <p>{message}</p>
        <p>Student Accommodation Finder for Zambia</p>
        <p style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: '20px' }}>By Goronga Charles Makuwerere</p>
      </header>
      <main>
        <section>
          <h2>Find Your Room</h2>
          <ul>
            {listings.map(listing => (
              <li key={listing.id} style={{ marginBottom: '10px' }}>
                <strong>{listing.name}</strong> - {listing.location} - ZMW {listing.price} <br /> Contact: {listing.contact}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Landlords: Add Your Property</h2>
          <form onSubmit={handleSubmit} className="listing-form">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Property Name" required />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" required />
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact Info" required />
            <button type="submit">Add Listing</button>
          </form>
        </section>
      </main>
      <footer>
        <p>© {new Date().getFullYear()} PaLevel. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;


/* === FILE: frontend/src/App.css === */
.App {
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f5f5f5;
}

.App-header {
  background-color: #004d40;
  color: white;
  padding: 50px 20px;
  min-height: 60vh;
}

.App-header h1 {
  font-size: 4rem;
  margin-bottom: 10px;
}

.App-header p {
  font-size: 1.5rem;
}

main {
  padding: 20px;
}

section {
  margin: 20px auto;
  max-width: 600px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

footer {
  background-color: #004d40;
  color: white;
  padding: 10px;
}

.listing-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.listing-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.listing-form button {
  padding: 10px;
  background-color: #004d40;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.listing-form button:hover {
  background-color: #00695c;
}

/* === TO DEPLOY ===
 1. cd frontend && npm run build
 2. cd .. && node server.js
 3. Push to Heroku, Render, or similar host
*/
