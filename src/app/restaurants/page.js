// RESTAURANTS LIST PAGE
// Displays user's restaurants and allows creating new ones
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./restaurants.css";

// RESTAURANTS LIST COMPONENT
// Manages restaurant display, creation, and navigation
export default function Restaurants() {
  const router = useRouter();
  
  // COMPONENT STATE MANAGEMENT
  // Tracks UI state, data, and form inputs
  const [showForm, setShowForm] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // FETCH RESTAURANTS ON PAGE LOAD
  // Loads user's restaurants when component mounts
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // FETCH RESTAURANTS FROM API
  // Retrieves all restaurants belonging to the current user
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
  // Creates a new restaurant and refreshes the list
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
  // Routes user to individual restaurant page
  const handleRestaurantClick = (restaurantId) => {
    router.push(`/restaurants/${restaurantId}`);
  };

  return (
    <main className="restaurants-container" role="main">
      <h1 className="restaurants-title">Your Restaurants</h1>

      {/* ERROR MESSAGE DISPLAY */}
      {/* Shows API errors and validation messages */}
      {error && (
        <div className="error-message" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {/* RESTAURANT LIST SECTION */}
      {/* Displays all user's restaurants with click navigation */}
      <section className="restaurants-list" aria-label="Restaurants">
        {loading ? (
          <p aria-live="polite">Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p>No restaurants yet. Create your first one!</p>
        ) : (
          restaurants.map((restaurant) => (
            <article
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => handleRestaurantClick(restaurant.id)}
              role="button"
              tabIndex={0}
              aria-label={`View ${restaurant.name} dashboard`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRestaurantClick(restaurant.id);
                }
              }}
            >
              <span className="restaurant-name">{restaurant.name}</span>
            </article>
          ))
        )}
      </section>

      {/* ADD RESTAURANT FORM */}
      {/* Form for creating new restaurants */}
      {showForm && (
        <form className="add-restaurant-form" onSubmit={handleSubmit} aria-label="Add restaurant form">
          <input
            type="text"
            placeholder="Restaurant Name"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            className="restaurant-input"
            required
            disabled={isSubmitting}
            aria-label="Restaurant name"
            autoComplete="off"
          />
          <div className="restaurant-form-buttons">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
              aria-describedby={isSubmitting ? "submitting-status" : undefined}
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
          {isSubmitting && (
            <div id="submitting-status" className="sr-only">
              Creating restaurant
            </div>
          )}
        </form>
      )}

      {/* ADD RESTAURANT BUTTON */}
      {/* Toggle button to show/hide the add restaurant form */}
      {!showForm && (
        <button
          className="add-restaurant-button"
          onClick={() => setShowForm(true)}
          aria-label="Add new restaurant"
        >
          Add Restaurant
        </button>
      )}
    </main>
  );
}
