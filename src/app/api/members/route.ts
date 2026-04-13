import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/storage";

export interface Member {
  id: string;
  name: string;
  company: string;
  status: "prospect" | "member" | "inactive";
  lastContact: string;
  notes: string;
  createdAt: string;
}

export async function GET() {
  const members = readData<Member[]>("members", []);
  return NextResponse.json({ members });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const members = readData<Member[]>("members", []);

  const member: Member = {
    id: Date.now().toString(),
    name: body.name,
    company: body.company || "",
    status: body.status || "prospect",
    lastContact: body.lastContact || new Date().toISOString().split("T")[0],
    notes: body.notes || "",
    createdAt: new Date().toISOString(),
  };

  members.unshift(member);
  writeData("members", members);
  return NextResponse.json({ member });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const members = readData<Member[]>("members", []);

  const idx = members.findIndex((m) => m.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  members[idx] = { ...members[idx], ...body };
  writeData("members", members);
  return NextResponse.json({ member: members[idx] });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const members = readData<Member[]>("members", []);
  const filtered = members.filter((m) => m.id !== id);
  writeData("members", filtered);
  return NextResponse.json({ ok: true });
}
