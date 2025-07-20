"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./restaurants.css";

export default function Restaurants() {
  const router = useRouter();
  
  // COMPONENT STATE
  const [showForm, setShowForm] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // FETCH RESTAURANTS ON PAGE LOAD
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // FETCH RESTAURANTS FROM API
  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants', {
        headers: {
          'user-id': '1' // TODO: Make this dynamic based on logged-in user
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      } else {
        setError('Failed to fetch restaurants');
        console.error('Failed to fetch restaurants');
      }
    } catch (error) {
      setError('Error loading restaurants');
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  // HANDLE RESTAURANT FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': '1' // TODO: Make this dynamic based on logged-in user
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
        setError('Failed to create restaurant');
        console.error('Failed to create restaurant');
      }
    } catch (error) {
      setError('Error creating restaurant');
      console.error('Error creating restaurant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // NAVIGATE TO RESTAURANT DASHBOARD
  const handleRestaurantClick = (restaurantId) => {
    router.push(`/restaurants/${restaurantId}`);
  };

  return (
    <main className="restaurants-container">
      <h1 className="restaurants-title">Your Restaurants</h1>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* RESTAURANT LIST */}
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
              onClick={() => handleRestaurantClick(restaurant.id)}
            >
              <span className="restaurant-name">{restaurant.name}</span>
            </article>
          ))
        )}
      </section>

      {/* ADD RESTAURANT FORM */}
      {showForm && (
        <form className="add-restaurant-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Restaurant Name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="restaurant-input"
            required
            disabled={isSubmitting}
          />
          <div className="restaurant-form-buttons">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Restaurant'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ADD RESTAURANT BUTTON */}
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
