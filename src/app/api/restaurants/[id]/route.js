// INDIVIDUAL RESTAURANT API ROUTE
// Handles operations for a specific restaurant (GET details and shifts)
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// GET HANDLER
// Retrieves restaurant details and associated shifts for the authenticated user
export async function GET(request, { params }) {
  try {
    // Extract user ID and restaurant ID from request
    const userId = request.headers.get("user-id");
    const resolvedParams = await params;
    const restaurantId = parseInt(resolvedParams.id);

    // Validate user authentication
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Validate restaurant ID parameter
    if (!restaurantId || isNaN(restaurantId)) {
      return NextResponse.json(
        { error: "Invalid restaurant ID" },
        { status: 400 }
      );
    }

    // Query restaurant and verify user has access
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        userRestaurants: {
          some: {
            userId: parseInt(userId),
          },
        },
      },
      include: {
        shifts: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    // Check if restaurant exists and user has access
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Return restaurant data with formatted shifts
    return NextResponse.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
      },
      shifts: restaurant.shifts.map((shift) => ({
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
      })),
    });
  } catch (error) {
    // Log error for debugging
    console.error("Get restaurant data error:", error);

    // Return generic error message for security
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
