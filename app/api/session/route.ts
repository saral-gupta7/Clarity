import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.error("Not Authenticated");
      return NextResponse.json(
        { error: "Not Authenticated", authenticated: false },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };

    return NextResponse.json({
      message: "Authenticated successfully",
      authenticated: true,
      admin: {
        id: decoded.id,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error("Failed to authenticate", error);
    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 401 }
    );
  }
}
