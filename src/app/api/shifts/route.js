// SHIFTS API ROUTE
// This API handles creating new shift records with automatic calculation of derived values
// such as percentages, averages, and totals based on user input data.
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// HELPER FUNCTIONS TO REDUCE REPETITION AND ENSURE CONSISTENT PARSING
// These functions safely convert string inputs to numbers, defaulting to 0 if invalid

/**
 * Safely converts a value to a float, defaulting to 0 if the value is null, undefined, or NaN
 * @param {any} value - The value to convert
 * @returns {number} - The parsed float value or 0
 */
const parseFloatSafe = (value) => parseFloat(value || 0);

/**
 * Safely converts a value to an integer, defaulting to 0 if the value is null, undefined, or NaN
 * @param {any} value - The value to convert
 * @returns {number} - The parsed integer value or 0
 */
const parseIntSafe = (value) => parseInt(value, 10) || 0;

// CALCULATION HELPER FUNCTIONS
// These functions perform the business logic calculations for derived values

/**
 * Calculates the tip percentage based on total tips and net revenue
 * @param {number} totalTips - Total tips (credit + cash)
 * @param {number} netRevenue - Net revenue amount
 * @returns {number} - Tip percentage (0-100)
 */
const calculateTipPercentage = (totalTips, netRevenue) => {
  const revenue = parseFloatSafe(netRevenue);
  return revenue > 0 ? (totalTips / revenue) * 100 : 0;
};

/**
 * Calculates what percentage of total sales a specific category represents
 * @param {number} salesAmount - Sales amount for the category
 * @param {number} netRevenue - Total net revenue
 * @returns {number} - Percentage of total sales (0-100)
 */
const calculatePercentageOfSales = (salesAmount, netRevenue) => {
  const revenue = parseFloatSafe(netRevenue);
  return revenue > 0 ? (parseFloatSafe(salesAmount) / revenue) * 100 : 0;
};

/**
 * Calculates the average check amount per customer/cover
 * @param {number} netRevenue - Total net revenue
 * @param {number} covers - Number of customers served
 * @returns {number} - Average check per cover
 */
const calculateAverageCheckPerCover = (netRevenue, covers) => {
  const coversCount = parseFloatSafe(covers);
  return coversCount > 0 ? parseFloatSafe(netRevenue) / coversCount : 0;
};

/**
 * Calculates the tipout percentage based on total tips and tips kept after tipout.
 * @param {number} creditTips - Original credit tips amount
 * @param {number} cashTips - Cash tips amount
 * @param {number} creditTipsAfterTipout - Credit tips remaining after tipout
 * @returns {number} - Tipout percentage (0-100)
 */
const calculateTipoutPercentage = (creditTips, cashTips, creditTipsAfterTipout) => {
  const totalTips = parseFloatSafe(creditTips) + parseFloatSafe(cashTips);
  const tipsKept = parseFloatSafe(creditTipsAfterTipout) + parseFloatSafe(cashTips);
  return totalTips > 0
    ? ((totalTips - tipsKept) / totalTips) * 100
    : 0;
};

// POST - CREATE A NEW SHIFT
// This endpoint creates a new shift record with automatic calculation of all derived values
export async function POST(request) {
  try {
    // EXTRACT USER ID FROM REQUEST HEADERS
    // TODO: Replace with proper authentication middleware
    const userId = request.headers.get("user-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // EXTRACT AND VALIDATE REQUEST DATA
    // All monetary values come as strings from the form and need to be parsed
    const {
      restaurantId,
      date,
      netRevenue,
      tax,
      totalWithTax, // This will be calculated, but user can override
      creditTips,
      cashTips,
      tipoutAmount,
      checks,
      covers,
      wineSales,
      beerSales,
      liquorSales,
      foodSales,
    } = await request.json();

    // VALIDATE REQUIRED FIELDS
    // These are the minimum fields needed to create a meaningful shift record
    if (!restaurantId || !date || !netRevenue || !tax) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // VERIFY USER ACCESS TO RESTAURANT
    // Ensures the user has permission to create shifts for this restaurant
    const userRestaurant = await prisma.userRestaurant.findFirst({
      where: {
        userId: parseInt(userId),
        restaurantId: parseInt(restaurantId),
      },
    });

    if (!userRestaurant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // CALCULATE DAY OF WEEK FROM DATE
    // Used for reporting and analysis purposes
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // CALCULATE ALL DERIVED VALUES
    // These calculations provide insights and analytics for the shift
    const totalTips = parseFloatSafe(creditTips) + parseFloatSafe(cashTips);
    const calculatedTotalWithTax =
      parseFloatSafe(netRevenue) + parseFloatSafe(tax);
    const averageCheckPerCover = calculateAverageCheckPerCover(
      netRevenue,
      covers
    );
    const winePercent = calculatePercentageOfSales(wineSales, netRevenue);
    const beerPercent = calculatePercentageOfSales(beerSales, netRevenue);
    const liquorPercent = calculatePercentageOfSales(liquorSales, netRevenue);
    const foodPercent = calculatePercentageOfSales(foodSales, netRevenue);
    const averageTipPercent = calculateTipPercentage(totalTips, netRevenue);
    const creditTipsAfterTipout =
      parseFloatSafe(creditTips) - parseFloatSafe(tipoutAmount);
    const tipoutPercent = calculateTipoutPercentage(
      creditTips,
      cashTips,
      creditTipsAfterTipout
    );

    // CREATE THE SHIFT RECORD IN DATABASE
    // All values are parsed and calculated before saving to ensure data integrity
    const shift = await prisma.shift.create({
      data: {
        // Basic shift information
        date: new Date(date),
        dayOfWeek,
        checks: parseIntSafe(checks),
        covers: parseIntSafe(covers),

        // Revenue information
        netRevenue: parseFloatSafe(netRevenue),
        totalWithTax: calculatedTotalWithTax,
        averageCheckPerCover: averageCheckPerCover,

        // Sales breakdown with percentages
        wineSales: parseFloatSafe(wineSales),
        winePercent: winePercent,
        beerSales: parseFloatSafe(beerSales),
        beerPercent: beerPercent,
        liquorSales: parseFloatSafe(liquorSales),
        liquorPercent: liquorPercent,
        foodSales: parseFloatSafe(foodSales),
        foodPercent: foodPercent,

        // Tips information
        creditTips: parseFloatSafe(creditTips),
        cashTips: parseFloatSafe(cashTips),
        totalTips: totalTips,
        averageTipPercent: averageTipPercent,
        creditTipsAfterTipout: creditTipsAfterTipout,
        tipoutPercent: tipoutPercent,

        // Relationship fields
        restaurantId: parseInt(restaurantId),
        userId: parseInt(userId),
      },
    });

    // RETURN SUCCESS RESPONSE WITH CREATED SHIFT DATA
    // Includes all calculated values for immediate use by the frontend
    return NextResponse.json(
      {
        message: "Shift created successfully",
        shift: {
          id: shift.id,
          date: shift.date,
          dayOfWeek: shift.dayOfWeek,
          checks: shift.checks,
          covers: shift.covers,
          netRevenue: shift.netRevenue,
          totalWithTax: shift.totalWithTax,
          averageCheckPerCover: shift.averageCheckPerCover,
          wineSales: shift.wineSales,
          winePercent: shift.winePercent,
          beerSales: shift.beerSales,
          beerPercent: shift.beerPercent,
          liquorSales: shift.liquorSales,
          liquorPercent: shift.liquorPercent,
          foodSales: shift.foodSales,
          foodPercent: shift.foodPercent,
          creditTips: shift.creditTips,
          cashTips: shift.cashTips,
          totalTips: shift.totalTips,
          averageTipPercent: shift.averageTipPercent,
          creditTipsAfterTipout: shift.creditTipsAfterTipout,
          tipoutPercent: shift.tipoutPercent,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // ERROR HANDLING
    // Log the error for debugging and return a generic error message to the client
    console.error("Create shift error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
