import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// GET - Get restaurant details and shifts
export async function GET(request, { params }) {
  try {
    const userId = request.headers.get('user-id');
    const resolvedParams = await params;
    const restaurantId = parseInt(resolvedParams.id);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // Get restaurant and verify user has access
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        userRestaurants: {
          some: {
            userId: parseInt(userId)  
          }
        }
      },
      include: {
        shifts: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name
      },
      shifts: restaurant.shifts.map(shift => ({
        id: shift.id,
        date: shift.date,
        netRevenue: shift.netRevenue,
        totalWithTax: shift.totalWithTax,
        creditTips: shift.creditTips,
        cashTips: shift.cashTips
      }))
    });

  } catch (error) {
    console.error('Get restaurant data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
