// SHIFTS API ROUTE
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// HELPER FUNCTIONS TO REDUCE REPETITION
const parseFloatSafe = (value) => parseFloat(value || 0);
const parseIntSafe = (value) => parseInt(value, 10) || 0;

const calculateTipPercentage = (totalTips, netRevenue) => {
  const revenue = parseFloatSafe(netRevenue);
  return revenue > 0 ? (totalTips / revenue) * 100 : 0;
};

// POST - CREATE A NEW SHIFT
export async function POST(request) {
  try {
    const userId = request.headers.get("user-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    const {
      restaurantId,
      date,
      netRevenue,
      totalWithTax,
      creditTips,
      cashTips,
      checks,
      covers,
      averageCheckPerCover,
      wineSales,
      winePercent,
      beerSales,
      beerPercent,
      liquorSales,
      liquorPercent,
      foodSales,
      foodPercent,
    } = await request.json();

    // VALIDATE REQUIRED FIELDS
    if (!restaurantId || !date || !netRevenue || !totalWithTax) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // VERIFY USER ACCESS TO RESTAURANT
    const userRestaurant = await prisma.userRestaurant.findFirst({
      where: {
        userId: parseInt(userId),
        restaurantId: parseInt(restaurantId),
      },
    });

    if (!userRestaurant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // GET DAY OF WEEK
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // CALCULATE TOTAL TIPS ONCE
    const totalTips = parseFloatSafe(creditTips) + parseFloatSafe(cashTips);

    // CREATE THE SHIFT
    const shift = await prisma.shift.create({
      data: {
        date: new Date(date),
        dayOfWeek,
        checks: parseIntSafe(checks),
        covers: parseIntSafe(covers),
        netRevenue: parseFloatSafe(netRevenue),
        totalWithTax: parseFloatSafe(totalWithTax),
        averageCheckPerCover: parseFloatSafe(averageCheckPerCover),
        wineSales: parseFloatSafe(wineSales),
        winePercent: parseFloatSafe(winePercent),
        beerSales: parseFloatSafe(beerSales),
        beerPercent: parseFloatSafe(beerPercent),
        liquorSales: parseFloatSafe(liquorSales),
        liquorPercent: parseFloatSafe(liquorPercent),
        foodSales: parseFloatSafe(foodSales),
        foodPercent: parseFloatSafe(foodPercent),
        creditTips: parseFloatSafe(creditTips),
        cashTips: parseFloatSafe(cashTips),
        totalTips: totalTips,
        averageTipPercent: calculateTipPercentage(totalTips, netRevenue),
        creditTipsAfterTipout: parseFloatSafe(creditTips),
        tipoutPercent: 0, // Assuming no tipout percent for now
        restaurantId: parseInt(restaurantId),
        userId: parseInt(userId),
      },
    });

    // RETURN SUCCESS RESPONSE
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
          totalTips: shift.totalTips,
          averageTipPercent: shift.averageTipPercent,
          creditTipsAfterTipout: shift.creditTipsAfterTipout,
          creditTips: shift.creditTips,
          cashTips: shift.cashTips,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create shift error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
