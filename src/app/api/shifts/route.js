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

const calculatePercentageOfSales = (salesAmount, netRevenue) => {
  const revenue = parseFloatSafe(netRevenue);
  return revenue > 0 ? (parseFloatSafe(salesAmount) / revenue) * 100 : 0;
};

const calculateAverageCheckPerCover = (netRevenue, covers) => {
  const coversCount = parseFloatSafe(covers);
  return coversCount > 0 ? parseFloatSafe(netRevenue) / coversCount : 0;
};

const calculateTipoutPercentage = (creditTips, creditTipsAfterTipout) => {
  const tips = parseFloatSafe(creditTips);
  return tips > 0 ? ((tips - parseFloatSafe(creditTipsAfterTipout)) / tips) * 100 : 0;
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
      tax,
      totalWithTax,
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
    if (!restaurantId || !date || !netRevenue || !tax) {
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

    // CALCULATE ALL DERIVED VALUES
    const totalTips = parseFloatSafe(creditTips) + parseFloatSafe(cashTips);
    const calculatedTotalWithTax = parseFloatSafe(netRevenue) + parseFloatSafe(tax);
    const averageCheckPerCover = calculateAverageCheckPerCover(netRevenue, covers);
    const winePercent = calculatePercentageOfSales(wineSales, netRevenue);
    const beerPercent = calculatePercentageOfSales(beerSales, netRevenue);
    const liquorPercent = calculatePercentageOfSales(liquorSales, netRevenue);
    const foodPercent = calculatePercentageOfSales(foodSales, netRevenue);
    const averageTipPercent = calculateTipPercentage(totalTips, netRevenue);
    const creditTipsAfterTipout = parseFloatSafe(creditTips) - parseFloatSafe(tipoutAmount);
    const tipoutPercent = calculateTipoutPercentage(creditTips, creditTipsAfterTipout);

    // CREATE THE SHIFT
    const shift = await prisma.shift.create({
      data: {
        date: new Date(date),
        dayOfWeek,
        checks: parseIntSafe(checks),
        covers: parseIntSafe(covers),
        netRevenue: parseFloatSafe(netRevenue),
        totalWithTax: calculatedTotalWithTax,
        averageCheckPerCover: averageCheckPerCover,
        wineSales: parseFloatSafe(wineSales),
        winePercent: winePercent,
        beerSales: parseFloatSafe(beerSales),
        beerPercent: beerPercent,
        liquorSales: parseFloatSafe(liquorSales),
        liquorPercent: liquorPercent,
        foodSales: parseFloatSafe(foodSales),
        foodPercent: foodPercent,
        creditTips: parseFloatSafe(creditTips),
        cashTips: parseFloatSafe(cashTips),
        totalTips: totalTips,
        averageTipPercent: averageTipPercent,
        creditTipsAfterTipout: creditTipsAfterTipout,
        tipoutPercent: tipoutPercent,
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
    console.error("Create shift error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
