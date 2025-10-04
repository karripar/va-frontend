import { NextResponse } from 'next/server';

// Mock profile data for development
export async function GET() {
  const mockProfile = {
    id: "1",
    userName: "Test User",
    email: "test@example.com",
    registeredAt: new Date().toISOString(),
    favorites: ["Finland", "Sweden", "Norway"],
    documents: ["passport.pdf", "visa.pdf"],
    exchangeBadge: true,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Student&mouth=default&eyes=default",
    linkedinUrl: "https://linkedin.com/in/testuser"
  };

  return NextResponse.json(mockProfile);
}
