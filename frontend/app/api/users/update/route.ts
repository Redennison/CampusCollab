import { NextRequest, NextResponse } from "next/server";

// Hardcoded auth token for testing
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhc2RmQGdtYWlsLmNvbSIsImV4cCI6MTc0OTg1MjI3Mn0.baf2mZAn3LCv6wflQNeUHvBGMv2_waePZB9091FAbjo";

export async function PATCH(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Make request to FastAPI backend
    const response = await fetch("http://localhost:8000/users/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
