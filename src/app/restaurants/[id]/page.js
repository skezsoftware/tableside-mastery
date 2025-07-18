'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import '../restaurants.css';

export default function RestaurantDashboard() {
  const params = useParams();
  const restaurantId = params.id;
  
  const [restaurant, setRestaurant] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [shiftData, setShiftData] = useState({
    date: '',
    netRevenue: '',
    totalWithTax: '',
    creditTips: '',
    cashTips: ''
  });

  useEffect(() => {
    fetchRestaurantData();
  }, [restaurantId]);

  const fetchRestaurantData = async () => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        headers: {
          'user-id': '1' // We'll make this dynamic later
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data.restaurant);
        setShifts(data.shifts);
      } else {
        console.error('Failed to fetch restaurant data');
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': '1' // We'll make this dynamic later
        },
        body: JSON.stringify({
          restaurantId: restaurantId,
          ...shiftData
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Shift created:', data);
        
        // Clear form and hide it
        setShiftData({
          date: '',
          netRevenue: '',
          totalWithTax: '',
          creditTips: '',
          cashTips: ''
        });
        setShowForm(false);
        
        // Refresh the data
        fetchRestaurantData();
      } else {
        console.error('Failed to create shift');
      }
    } catch (error) {
      console.error('Error creating shift:', error);
    }
  };

  if (loading) {
    return <div className="restaurants-container">Loading...</div>;
  }

  return (
    <main className="restaurants-container">
      <div className="dashboard-header">
        <a href="/restaurants" className="back-link">← Back to Restaurants</a>
        <h1 className="restaurants-title">
          {restaurant ? restaurant.name : 'Restaurant Dashboard'}
        </h1>
      </div>

      {/* Shifts List */}
      <section className="restaurants-list">
        {shifts.length === 0 ? (
          <p>No shifts yet. Add your first shift!</p>
        ) : (
          shifts.map((shift) => (
            <article key={shift.id} className="restaurant-card">
              <div className="shift-info">
                <span className="shift-date">
                  {new Date(shift.date).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Add Shift Form */}
      {showForm && (
        <form className="add-restaurant-form" onSubmit={handleSubmit}>
          <input
            type="date"
            value={shiftData.date}
            onChange={(e) => setShiftData({...shiftData, date: e.target.value})}
            className="restaurant-input"
            required
          />
          <input
            type="number"
            placeholder="Net Revenue"
            value={shiftData.netRevenue}
            onChange={(e) => setShiftData({...shiftData, netRevenue: e.target.value})}
            className="restaurant-input"
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Total with Tax"
            value={shiftData.totalWithTax}
            onChange={(e) => setShiftData({...shiftData, totalWithTax: e.target.value})}
            className="restaurant-input"
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Credit Tips"
            value={shiftData.creditTips}
            onChange={(e) => setShiftData({...shiftData, creditTips: e.target.value})}
            className="restaurant-input"
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Cash Tips"
            value={shiftData.cashTips}
            onChange={(e) => setShiftData({...shiftData, cashTips: e.target.value})}
            className="restaurant-input"
            step="0.01"
            required
          />
          <div className="restaurant-form-buttons">
            <button type="submit" className="submit-button">
              Add Shift
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

      {/* Add Shift Button */}
      {!showForm && (
        <button
          className="add-restaurant-button"
          onClick={() => setShowForm(true)}
        >
          Add New Shift
        </button>
      )}
    </main>
  );
}
