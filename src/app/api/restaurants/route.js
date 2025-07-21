// RESTAURANTS API ROUTE
// Handles CRUD operations for restaurants (GET all, POST create)
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// GET HANDLER
// Retrieves all restaurants belonging to the authenticated user
export async function GET(request) {
  try {
    // Extract user ID from request headers
    const userId = request.headers.get("user-id");

    // Validate user authentication
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Query restaurants with shift count for the authenticated user
    const restaurants = await prisma.restaurant.findMany({
      where: {
        userRestaurants: {
          some: {
            userId: parseInt(userId),
          },
        },
      },
      include: {
        _count: {
          select: { shifts: true },
        },
      },
    });

    // Return restaurants array
    return NextResponse.json(restaurants);
  } catch (error) {
    // Log error for debugging
    console.error("Get restaurants error:", error);

    // Return generic error message for security
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST HANDLER
// Creates a new restaurant and links it to the authenticated user
export async function POST(request) {
  try {
    // Extract user ID from request headers
    const userId = request.headers.get("user-id");

    // Validate user authentication
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Parse restaurant data from request body
    const { name } = await request.json();

    // Validate required restaurant name
    if (!name) {
      return NextResponse.json(
        { error: "Restaurant name required" },
        { status: 400 }
      );
    }

    // Create restaurant and link to user in a single transaction
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        userRestaurants: {
          create: {
            userId: parseInt(userId),
          },
        },
      },
    });

    // Return success response with restaurant data
    return NextResponse.json(
      {
        message: "Restaurant created successfully",
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Log error for debugging
    console.error("Create restaurant error:", error);

    // Return generic error message for security
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
