import { NextResponse } from 'next/server';

// Mock profile data for development
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const mockProfile = {
    id: id,
    userName: `User ${id}`,
    email: `user${id}@example.com`,
    registeredAt: new Date().toISOString(),
    favorites: ["Finland", "Sweden", "Spain"],
    documents: ["vaihtohakemus.pdf", "Vaihto-opas.pdf"],
    exchangeBadge: id === "1",
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${id}`,
    linkedinUrl: `https://linkedin.com/in/user${id}`
  };

  return NextResponse.json(mockProfile);
}
