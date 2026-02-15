import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const handler = async (req: NextRequest) => {
  return auth.handler(req)
}

export { handler as GET, handler as POST }
