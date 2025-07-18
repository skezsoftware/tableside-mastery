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
      cashTips 
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
        checks, // Add default values for required fields
        covers,
        netRevenue: parseFloat(netRevenue),
        totalWithTax: parseFloat(totalWithTax),
        averageCheckPerCover,
        wineSales,
        winePercent,
        beerSales,
        beerPercent,
        liquorSales,
        liquorPercent,
        foodSales,
        foodPercent,
        creditTips: parseFloat(creditTips || 0),
        cashTips: parseFloat(cashTips || 0),
        totalTips: parseFloat(creditTips || 0) + parseFloat(cashTips || 0),
        averageTipPercent: 0,
        creditTipsAfterTipout: parseFloat(creditTips || 0),
        tipoutPercent: 0,
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
          netRevenue: shift.netRevenue,
          totalWithTax: shift.totalWithTax,
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
