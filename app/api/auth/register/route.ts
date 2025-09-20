import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcrypt"
import type { User } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const usersCollection = db.collection<Omit<User, "id"> & { _id: any }>("users")

    const user = await usersCollection.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Retorna o usuário sem a senha
    const userToReturn = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }

    return NextResponse.json(userToReturn, { status: 200 })
  } catch (e) {
    console.error("Erro no login:", e)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
