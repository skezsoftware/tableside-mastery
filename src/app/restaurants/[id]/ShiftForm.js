// SHIFT FORM COMPONENT
// Handles the form for adding new shifts to a restaurant
"use client";

import { useState } from "react";

// SHIFT FORM COMPONENT
// Manages shift data entry and submission
export default function ShiftForm({ restaurantId, onSubmit, onCancel }) {
  // SHIFT DATA ENTRY FORM STATE
  // Tracks all form inputs for new shift creation
  const [shiftData, setShiftData] = useState({
    date: "",
    dayOfWeek: "",
    checks: "",
    covers: "",
    netRevenue: "",
    tax: "",
    totalWithTax: "",
    wineSales: "",
    beerSales: "",
    liquorSales: "",
    foodSales: "",
    creditTips: "",
    cashTips: "",
    tipoutAmount: "",
  });

  // HANDLE FORM SUBMISSION
  // Processes form data and calls parent component's submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ restaurantId, ...shiftData });
  };

  return (
    <form
      className="add-restaurant-form"
      onSubmit={handleSubmit}
      aria-label="Add shift form"
    >
      {/* Date Selector */}
      <label htmlFor="shift-date">Date</label>
      <input
        id="shift-date"
        type="date"
        value={shiftData.date}
        onChange={(e) => setShiftData({ ...shiftData, date: e.target.value })}
        className="restaurant-input"
        required
        aria-describedby="date-help"
      />
      <div id="date-help" className="sr-only">
        Select the date of the shift
      </div>

      {/* Day of the Week */}
      <label htmlFor="shift-day">Day of the Week</label>
      <input
        id="shift-day"
        type="text"
        placeholder="Day of the Week"
        value={shiftData.dayOfWeek}
        onChange={(e) =>
          setShiftData({ ...shiftData, dayOfWeek: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        required
        aria-describedby="day-help"
      />
      <div id="day-help" className="sr-only">
        Enter the day of the week
      </div>

      {/* Total Checks */}
      <label htmlFor="shift-checks">Total Checks</label>
      <input
        id="shift-checks"
        type="number"
        placeholder="Total Checks"
        value={shiftData.checks}
        onChange={(e) => setShiftData({ ...shiftData, checks: e.target.value })}
        className="restaurant-input"
        step="0.01"
        required
        aria-describedby="checks-help"
      />
      <div id="checks-help" className="sr-only">
        Enter the total number of checks
      </div>

      {/* Total Covers */}
      <label htmlFor="shift-covers">Total Covers</label>
      <input
        id="shift-covers"
        type="number"
        placeholder="Total Covers"
        value={shiftData.covers}
        onChange={(e) => setShiftData({ ...shiftData, covers: e.target.value })}
        className="restaurant-input"
        step="0.01"
        required
        aria-describedby="covers-help"
      />
      <div id="covers-help" className="sr-only">
        Enter the total number of covers
      </div>

      {/* Net Revenue */}
      <label htmlFor="shift-net-revenue">Net Revenue</label>
      <input
        id="shift-net-revenue"
        type="number"
        placeholder="Net Revenue"
        value={shiftData.netRevenue}
        onChange={(e) =>
          setShiftData({ ...shiftData, netRevenue: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        required
        aria-describedby="net-revenue-help"
      />
      <div id="net-revenue-help" className="sr-only">
        Enter the net revenue amount
      </div>

      {/* Tax Amount */}
      <label htmlFor="shift-tax">Tax Amount</label>
      <input
        id="shift-tax"
        type="number"
        placeholder="Tax Amount"
        value={shiftData.tax}
        onChange={(e) => setShiftData({ ...shiftData, tax: e.target.value })}
        className="restaurant-input"
        step="0.01"
        required
        aria-describedby="tax-help"
      />
      <div id="tax-help" className="sr-only">
        Enter the tax amount
      </div>

      {/* Total with Tax (Calculated) */}
      <label htmlFor="shift-total-tax">Total with Tax (Calculated)</label>
      <input
        id="shift-total-tax"
        type="number"
        placeholder="Total with Tax"
        value={shiftData.totalWithTax}
        onChange={(e) =>
          setShiftData({ ...shiftData, totalWithTax: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        required
        aria-describedby="total-tax-help"
      />
      <div id="total-tax-help" className="sr-only">
        Enter the total with tax amount
      </div>

      {/* Total Wine Sales Amount */}
      <label htmlFor="shift-wine-sales">Total Wine Sales Amount</label>
      <input
        id="shift-wine-sales"
        type="number"
        placeholder="Total Wine Sales Amount"
        value={shiftData.wineSales}
        onChange={(e) =>
          setShiftData({ ...shiftData, wineSales: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        aria-describedby="wine-sales-help"
      />
      <div id="wine-sales-help" className="sr-only">
        Enter the total wine sales amount
      </div>

      {/* Total Beer Sales Amount */}
      <label htmlFor="shift-beer-sales">Total Beer Sales Amount</label>
      <input
        id="shift-beer-sales"
        type="number"
        placeholder="Total Beer Sales Amount"
        value={shiftData.beerSales}
        onChange={(e) =>
          setShiftData({ ...shiftData, beerSales: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        aria-describedby="beer-sales-help"
      />
      <div id="beer-sales-help" className="sr-only">
        Enter the total beer sales amount
      </div>

      {/* Total Liquor Sales Amount */}
      <label htmlFor="shift-liquor-sales">Total Liquor Sales Amount</label>
      <input
        id="shift-liquor-sales"
        type="number"
        placeholder="Total Liquor Sales Amount"
        value={shiftData.liquorSales}
        onChange={(e) =>
          setShiftData({ ...shiftData, liquorSales: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        aria-describedby="liquor-sales-help"
      />
      <div id="liquor-sales-help" className="sr-only">
        Enter the total liquor sales amount
      </div>

      {/* Total Food Sales Amount */}
      <label htmlFor="shift-food-sales">Total Food Sales Amount</label>
      <input
        id="shift-food-sales"
        type="number"
        placeholder="Total Food Sales Amount"
        value={shiftData.foodSales}
        onChange={(e) =>
          setShiftData({ ...shiftData, foodSales: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        aria-describedby="food-sales-help"
      />
      <div id="food-sales-help" className="sr-only">
        Enter the total food sales amount
      </div>

      {/* CREDIT TIPS */}
      <label htmlFor="shift-credit-tips">Credit Tips</label>
      <input
        id="shift-credit-tips"
        type="number"
        placeholder="Credit Tips"
        value={shiftData.creditTips}
        onChange={(e) =>
          setShiftData({ ...shiftData, creditTips: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        required
        aria-describedby="credit-tips-help"
      />
      <div id="credit-tips-help" className="sr-only">
        Enter the credit tips amount
      </div>

      {/* CASH TIPS */}
      <label htmlFor="shift-cash-tips">Cash Tips</label>
      <input
        id="shift-cash-tips"
        type="number"
        placeholder="Cash Tips"
        value={shiftData.cashTips}
        onChange={(e) =>
          setShiftData({ ...shiftData, cashTips: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        required
        aria-describedby="cash-tips-help"
      />
      <div id="cash-tips-help" className="sr-only">
        Enter the cash tips amount
      </div>

      {/* TIPOUT AMOUNT */}
      <label htmlFor="shift-tipout">Tipout Amount</label>
      <input
        id="shift-tipout"
        type="number"
        placeholder="Tipout Amount"
        value={shiftData.tipoutAmount}
        onChange={(e) =>
          setShiftData({ ...shiftData, tipoutAmount: e.target.value })
        }
        className="restaurant-input"
        step="0.01"
        required
        aria-describedby="tipout-help"
      />
      <div id="tipout-help" className="sr-only">
        Enter the tipout amount
      </div>

      {/* FORM BUTTONS */}
      <div className="restaurant-form-buttons">
        <button type="submit" className="submit-button">
          Add Shift
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
