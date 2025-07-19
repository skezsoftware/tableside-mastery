// SHIFT DATA ENTRY FORM PAGE

"use client";
import Link from "next/link";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "../restaurants.css";

export default function RestaurantDashboard() {
  const params = useParams();
  const restaurantId = params.id;
  const [restaurant, setRestaurant] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [shiftData, setShiftData] = useState({
    date: "",
    dayOfWeek: "",
    checks: "",
    covers: "",
    netRevenue: "",
    totalWithTax: "",
    wineSales: "",
    beerSales: "",
    liquorSales: "",
    foodSales: "",
    creditTips: "",
    cashTips: "",
  });

  useEffect(() => {
    fetchRestaurantData();
  }, [restaurantId]);

  const fetchRestaurantData = async () => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        headers: {
          "user-id": "1", // We'll make this dynamic later
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRestaurant(data.restaurant);
        setShifts(data.shifts);
      } else {
        console.error("Failed to fetch restaurant data");
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/shifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": "1", // We'll make this dynamic later
        },
        body: JSON.stringify({
          restaurantId: restaurantId,
          ...shiftData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Shift created:", data);

        // Clear form and hide it
        setShiftData({
          date: "",
          dayOfWeek: "",
          checks: "",
          covers: "",
          netRevenue: "",
          totalWithTax: "",
          wineSales: "",
          beerSales: "",
          liquorSales: "",
          foodSales: "",
          creditTips: "",
          cashTips: "",
        });
        setShowForm(false);

        // Refresh the data
        fetchRestaurantData();
      } else {
        console.error("Failed to create shift");
      }
    } catch (error) {
      console.error("Error creating shift:", error);
    }
  };

  if (loading) {
    return <div className="restaurants-container">Loading...</div>;
  }
  console.log("shifts", shifts);

  const keyLabels = {
    id: "ID",
    date: "Date",
    dayOfWeek: "Day of Week",
    checks: "Checks",
    covers: "Covers",
    netRevenue: "Net Revenue",
    totalWithTax: "Total with Tax",
    wineSales: "Wine Sales",
    beerSales: "Beer Sales",
    liquorSales: "Liquor Sales",
    foodSales: "Food Sales",
    creditTips: "Credit Tips",
    cashTips: "Cash Tips",
    totalTips: "Total Tips",
    averageTipPercent: "Average Tip Percent",
    creditTipsAfterTipout: "Credit Tips After Tipout",
    tipoutPercent: "Tipout Percent",
    notes: "Notes",
    clockIn: "Clock In",
    clockOut: "Clock Out",
    hoursWorked: "Hours Worked",
    hourlyWage: "Hourly Wage",
  };
  
  return (
    <main className="restaurants-container">
      <div className="dashboard-header">
        <Link href="/restaurants" className="back-link">
          Back to Restaurants (click)
        </Link>
        <h1 className="restaurants-title">
          {restaurant ? restaurant.name : "Restaurant Dashboard"}
        </h1>
      </div>

      {/* Shifts List */}
      <section className="shifts-list">
        {shifts.length === 0 ? (
          <p>No shifts yet. Add your first shift!</p>
        ) : (
          shifts.map((shift) => (
            <article key={shift.id} className="shift-card">
              <div className="shift-info">
                {Object.entries(shift).map(([key, value]) => (
                  <div key={key} className={`shift-${key}`}>
                    <strong>{keyLabels[key] || key}:</strong>{" "}
                    {key === "date"
                      ? new Date(value).toLocaleDateString("en-US", {
                        timeZone: "UTC",}
                      )
                      : value.toString()}
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </section>
      

      {/* Add Shift Form */}
      {showForm && (
        <form className="add-restaurant-form" onSubmit={handleSubmit}>
          {/* Date Selector */}
          <input
            type="date"
            value={shiftData.date}
            onChange={(e) =>
              setShiftData({ ...shiftData, date: e.target.value })
            }
            className="restaurant-input"
            required
          />

          {/* Day of the Week */}
          <input
            type="text"
            placeholder="Day of the Week"
            value={shiftData.dayOfWeek}
            onChange={(e) =>
              setShiftData({ ...shiftData, dayOfWeek: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
            required
          />

          {/* Total Checks */}
          <input
            type="number"
            placeholder="Total Checks"
            value={shiftData.checks}
            onChange={(e) =>
              setShiftData({ ...shiftData, checks: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
            required
          />

          {/* Total Covers */}
          <input
            type="number"
            placeholder="Total Covers"
            value={shiftData.covers}
            onChange={(e) =>
              setShiftData({ ...shiftData, covers: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
            required
          />

          {/* Net Revenue */}
          <input
            type="number"
            placeholder="Net Revenue"
            value={shiftData.netRevenue}
            onChange={(e) =>
              setShiftData({ ...shiftData, netRevenue: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
            required
          />

          {/* Net Revenue + Tax */}
          <input
            type="number"
            placeholder="Net Revenue + Tax"
            value={shiftData.totalWithTax}
            onChange={(e) =>
              setShiftData({ ...shiftData, totalWithTax: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
            required
          />

          {/* TODO: Average Check Per Cover Calculation */}

          {/* Total Wine Sales Amount */}
          <input
            type="number"
            placeholder="Total Wine Sales Amount"
            value={shiftData.wineSales}
            onChange={(e) =>
              setShiftData({ ...shiftData, wineSales: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
          />

          {/* TODO: Average Wine Percent of Sales Calculation */}

          {/* Total Beer Sales Amount */}
          <input
            type="number"
            placeholder="Total Beer Sales Amount"
            value={shiftData.beerSales}
            onChange={(e) =>
              setShiftData({ ...shiftData, beerSales: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
          />

          {/* TODO: Average Beer Percent of Sales Calculation */}

          {/* Total Liquor Sales Amount */}
          <input
            type="number"
            placeholder="Total Liquor Sales Amount"
            value={shiftData.liquorSales}
            onChange={(e) =>
              setShiftData({ ...shiftData, liquorSales: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
          />

          {/* TODO: Average Liquor Percent of Sales Calculation */}

          {/* Total Food Sales Amount */}
          <input
            type="number"
            placeholder="Total Food Sales Amount"
            value={shiftData.foodSales}
            onChange={(e) =>
              setShiftData({ ...shiftData, foodSales: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
          />

          <input
            type="number"
            placeholder="Credit Tips"
            value={shiftData.creditTips}
            onChange={(e) =>
              setShiftData({ ...shiftData, creditTips: e.target.value })
            }
            className="restaurant-input"
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Cash Tips"
            value={shiftData.cashTips}
            onChange={(e) =>
              setShiftData({ ...shiftData, cashTips: e.target.value })
            }
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
