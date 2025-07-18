import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET - Get user's restaurants
export async function GET(request) {
  try {
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const restaurants = await prisma.restaurant.findMany({
      where: {
        userRestaurants: {
          some: {
            userId: parseInt(userId)
          }
        }
      },
      include: {
        _count: {
          select: { shifts: true }
        }
      }
    });

    return NextResponse.json(restaurants);

  } catch (error) {
    console.error('Get restaurants error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new restaurant
export async function POST(request) {
  try {
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Restaurant name required' },
        { status: 400 }
      );
    }

    // Create restaurant and link to user
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        userRestaurants: {
          create: {
            userId: parseInt(userId)
          }
        }
      }
    });

    return NextResponse.json(
      { 
        message: 'Restaurant created successfully',
        restaurant: {
          id: restaurant.id,
          name: restaurant.name
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create restaurant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
