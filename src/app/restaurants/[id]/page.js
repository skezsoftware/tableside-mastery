// RESTAURANT DASHBOARD PAGE
// Individual restaurant page showing shifts and shift entry form
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ShiftForm from "./ShiftForm";
import "../restaurants.css";

// RESTAURANT DASHBOARD COMPONENT
// Manages restaurant data display, shift entry, and data formatting
export default function RestaurantDashboard() {
  const params = useParams();
  const restaurantId = params.id;

  // FORMATTING HELPER FUNCTIONS
  // Format monetary values with currency symbol and commas
  const formatMonetaryValue = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Format percentage values with 2 decimal places
  const formatPercentageValue = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // FIELD CATEGORIZATION
  // Lists of fields that need specific formatting
  const monetaryFields = [
    "netRevenue",
    "totalWithTax",
    "averageCheckPerCover",
    "wineSales",
    "beerSales",
    "liquorSales",
    "foodSales",
    "creditTips",
    "cashTips",
    "totalTips",
    "creditTipsAfterTipout",
    "hourlyWage",
  ];

  const percentageFields = [
    "winePercent",
    "beerPercent",
    "liquorPercent",
    "foodPercent",
    "averageTipPercent",
    "tipoutPercent",
  ];

  // COMPONENT STATE MANAGEMENT
  // Tracks restaurant data, shifts, and form state
  const [restaurant, setRestaurant] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // FETCH RESTAURANT DATA ON PAGE LOAD
  // Loads restaurant details and shifts when component mounts
  useEffect(() => {
    fetchRestaurantData();
  }, [restaurantId]);

  // FETCH RESTAURANT DATA AND SHIFTS
  // Retrieves restaurant information and associated shifts from API
  const fetchRestaurantData = async () => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        headers: {
          "user-id": "1", // TODO: Make this dynamic based on logged-in user
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

  // HANDLE SHIFT FORM SUBMISSION
  // Creates a new shift and refreshes the data
  const handleShiftSubmit = async (shiftData) => {
    try {
      const response = await fetch("/api/shifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": "1", // TODO: Make this dynamic based on logged-in user
        },
        body: JSON.stringify(shiftData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Shift created:", data);

        // Hide form and refresh data
        setShowForm(false);
        fetchRestaurantData();
      } else {
        console.error("Failed to create shift");
      }
    } catch (error) {
      console.error("Error creating shift:", error);
    }
  };

  // HANDLE FORM CANCELLATION
  // Hides the shift form
  const handleFormCancel = () => {
    setShowForm(false);
  };

  // LOADING STATE
  // Shows loading message while data is being fetched
  if (loading) {
    return (
      <div className="restaurants-container" role="main">
        Loading...
      </div>
    );
  }

  // FIELD LABELS MAPPING
  // Maps database field names to user-friendly display labels
  const keyLabels = {
    id: "ID",
    date: "Date",
    dayOfWeek: "Day of Week",
    checks: "Checks",
    covers: "Covers",
    netRevenue: "Net Revenue",
    totalWithTax: "Total with Tax",
    averageCheckPerCover: "Avg Check Per Cover",
    wineSales: "Wine Sales",
    winePercent: "Wine % of Sales",
    beerSales: "Beer Sales",
    beerPercent: "Beer % of Sales",
    liquorSales: "Liquor Sales",
    liquorPercent: "Liquor % of Sales",
    foodSales: "Food Sales",
    foodPercent: "Food % of Sales",
    creditTips: "Credit Tips",
    cashTips: "Cash Tips",
    totalTips: "Total Tips",
    averageTipPercent: "Avg Tip %",
    creditTipsAfterTipout: "Credit Tips After Tipout",
    tipoutPercent: "Tipout %",
    notes: "Notes",
    clockIn: "Clock In",
    clockOut: "Clock Out",
    hoursWorked: "Hours Worked",
    hourlyWage: "Hourly Wage",
  };

  // MAIN COMPONENT RENDER
  return (
    <main className="restaurants-container" role="main">
      {/* DASHBOARD HEADER */}
      {/* Navigation and restaurant title */}
      <div className="dashboard-header">
        <Link
          href="/restaurants"
          className="back-link"
          aria-label="Back to restaurants list"
        >
          Back to Restaurants (click)
        </Link>
        <h1 className="restaurants-title">
          {restaurant ? restaurant.name : "Restaurant Dashboard"}
        </h1>
      </div>

      {/* SHIFTS LIST SECTION */}
      {/* Displays all shifts for this restaurant with formatted data */}
      <section className="shifts-list" aria-label="Shifts">
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
                          timeZone: "UTC",
                        })
                      : monetaryFields.includes(key)
                      ? formatMonetaryValue(value)
                      : percentageFields.includes(key)
                      ? formatPercentageValue(value)
                      : value.toString()}
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </section>

      {/* SHIFT FORM */}
      {/* Form for entering new shift data */}
      {showForm && (
        <ShiftForm
          restaurantId={restaurantId}
          onSubmit={handleShiftSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* ADD SHIFT BUTTON */}
      {/* Toggle button to show/hide the add shift form */}
      {!showForm && (
        <button
          className="add-restaurant-button"
          onClick={() => setShowForm(true)}
          aria-label="Add new shift"
        >
          Add New Shift
        </button>
      )}
    </main>
  );
}
