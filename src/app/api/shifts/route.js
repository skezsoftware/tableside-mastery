import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// POST - Create new shift
export async function POST(request) {
  try {
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const { 
      restaurantId, 
      date, 
      netRevenue, 
      totalWithTax, 
      creditTips, 
      cashTips,
      checks = 0, // Default to 0 if not provided
      covers = 0, // Default to 0 if not provided
      averageCheckPerCover = 0, // Default to 0 if not provided
      wineSales = 0, // Default to 0 if not provided
      winePercent = 0, // Default to 0 if not provided
      beerSales = 0, // Default to 0 if not provided
      beerPercent = 0, // Default to 0 if not provided
      liquorSales = 0, // Default to 0 if not provided
      liquorPercent = 0, // Default to 0 if not provided
      foodSales = 0, // Default to 0 if not provided
      foodPercent = 0 // Default to 0 if not provided 
    } = await request.json();

    // Validate required fields
    if (!restaurantId || !date || !netRevenue || !totalWithTax) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user has access to restaurant
    const userRestaurant = await prisma.userRestaurant.findFirst({
      where: {
        userId: parseInt(userId),
        restaurantId: parseInt(restaurantId)
      }
    });

    if (!userRestaurant) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get day of week from date
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

    // Create the shift
    const shift = await prisma.shift.create({
      data: {
        date: new Date(date),
        dayOfWeek,
        checks: parseInt(checks, 10) || 0,
        covers: parseInt(covers, 10) || 0,
        netRevenue: parseFloat(netRevenue) || 0,
        totalWithTax: parseFloat(totalWithTax) || 0,
        averageCheckPerCover: parseFloat(averageCheckPerCover) || 0,
        wineSales: parseFloat(wineSales || 0),
        winePercent: parseFloat(winePercent || 0),
        beerSales: parseFloat(beerSales || 0),
        beerPercent: parseFloat(beerPercent || 0),
        liquorSales: parseFloat(liquorSales || 0),
        liquorPercent: parseFloat(liquorPercent || 0),
        foodSales: parseFloat(foodSales || 0),
        foodPercent: parseFloat(foodPercent || 0),
        creditTips: parseFloat(creditTips || 0),
        cashTips: parseFloat(cashTips || 0),
        totalTips: parseFloat(creditTips || 0) + parseFloat(cashTips || 0),
        averageTipPercent: parseFloat(((parseFloat(creditTips || 0) + parseFloat(cashTips || 0)) / parseFloat(netRevenue || 1)) * 100) || 0,
        creditTipsAfterTipout: parseFloat(creditTips || 0),
        tipoutPercent: 0, // Assuming no tipout percent for now
        restaurantId: parseInt(restaurantId),
        userId: parseInt(userId)
      }
    });

    return NextResponse.json(
      { 
        message: 'Shift created successfully',
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
          cashTips: shift.cashTips
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create shift error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
