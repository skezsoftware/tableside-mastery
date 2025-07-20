// RESTAURANT ID API ROUTE
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

// GET - GET RESTAURANT DETAILS AND SHIFTS
export async function GET(request, { params }) {
  try {
    const userId = request.headers.get("user-id");
    const resolvedParams = await params;
    const restaurantId = parseInt(resolvedParams.id);

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // GET RESTAURANT AND VERIFY USER HAS ACCESS
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

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

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
    console.error("Get restaurant data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
