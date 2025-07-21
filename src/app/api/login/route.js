// LOGIN API ROUTE
// Handles user authentication by validating email/password and returning user data
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../../generated/prisma";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// POST HANDLER
// Processes login requests and authenticates users
export async function POST(request) {
  try {
    // Parse request body to extract email and password
    const { email, password } = await request.json();

    // Validate required input fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in database by email address
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists in database
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" }, // Generic message for security
        { status: 401 }
      );
    }

    // Verify password using bcrypt comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if password matches stored hash
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" }, // Generic message for security
        { status: 401 }
      );
    }

    // Return successful login response with user data (excluding password)
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    // Log error for debugging purposes
    console.error("Login error:", error);
    
    // Return generic error message for security
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
