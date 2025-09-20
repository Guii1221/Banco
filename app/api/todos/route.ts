// app/api/todos/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Todo, CreateTodoData } from "@/lib/todo-service"

// GET: Listar tarefas de um usuário
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ message: "userId é obrigatório" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const todos = await db.collection("todos").find({ userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(todos)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Erro ao buscar tarefas" }, { status: 500 })
  }
}

// POST: Criar uma nova tarefa
export async function POST(request: Request) {
  try {
    const { userId, data } = (await request.json()) as { userId: string; data: CreateTodoData }

    if (!userId || !data) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const newTodo: Omit<Todo, "id"> & { _id?: ObjectId } = {
      userId,
      title: data.title,
      description: data.description,
      completed: false,
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("todos").insertOne(newTodo)

    // O MongoDB retorna _id, mas nossa aplicação usa id.
    const createdTodo = { ...newTodo, id: result.insertedId.toString() }
    delete createdTodo._id

    return NextResponse.json(createdTodo, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Erro ao criar tarefa" }, { status: 500 })
  }
}
