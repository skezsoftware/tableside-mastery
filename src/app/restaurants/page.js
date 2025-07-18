"use client";

import { useState, useEffect } from "react";
import "./restaurants.css";

export default function Restaurants() {
  const [showForm, setShowForm] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch restaurants when page loads
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants', {
        headers: {
          'user-id': '1' // We'll make this dynamic later
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      } else {
        console.error('Failed to fetch restaurants');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': '1' // We'll make this dynamic later
        },
        body: JSON.stringify({ name: restaurantName })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Restaurant created:', data);
        
        // Clear form and hide it
        setRestaurantName('');
        setShowForm(false);
        
        // Refresh the restaurants list
        fetchRestaurants();
      } else {
        console.error('Failed to create restaurant');
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };

  return (
    <main className="restaurants-container">
      <h1 className="restaurants-title">Your Restaurants</h1>

      {/* Restaurant List */}
      <section className="restaurants-list">
        {loading ? (
          <p>Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p>No restaurants yet. Create your first one!</p>
        ) : (
          restaurants.map((restaurant) => (
            <article
              key={restaurant.id}
              className="restaurant-card"
              onClick={() =>
                (window.location.href = `/restaurants/${restaurant.id}`)
              }
            >
              <span className="restaurant-name">{restaurant.name}</span>
            </article>
          ))
        )}
      </section>

      {/* Add Restautant Form */}
      {showForm && (
        <form className="add-restaurant-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Restaurant Name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="restaurant-input"
            required
          />
          <div className="restaurant-form-buttons">
            <button type="submit" className="submit-button">
              Create Restaurant
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add Restaurant Button */}
      {!showForm && (
        <button
          className="add-restaurant-button"
          onClick={() => setShowForm(true)}
        >
          Add Restaurant
        </button>
      )}
    </main>
  );
}
