// app/api/todos/[id]/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { UpdateTodoData } from "@/lib/todo-service"

// PUT: Atualizar uma tarefa
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const todoId = params.id
    const data: UpdateTodoData = await request.json()

    if (!ObjectId.isValid(todoId)) {
      return NextResponse.json({ message: "ID de tarefa inválido" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const updateData = { ...data, updatedAt: new Date().toISOString() }

    const result = await db
      .collection("todos")
      .findOneAndUpdate({ _id: new ObjectId(todoId) }, { $set: updateData }, { returnDocument: "after" })

    if (!result) {
      return NextResponse.json({ message: "Tarefa não encontrada" }, { status: 404 })
    }

    // Renomeia _id para id para consistência com o front-end
    const { _id, ...updatedTodo } = result
    return NextResponse.json({ ...updatedTodo, id: _id.toString() })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Erro ao atualizar tarefa" }, { status: 500 })
  }
}

// DELETE: Deletar uma tarefa
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const todoId = params.id

    if (!ObjectId.isValid(todoId)) {
      return NextResponse.json({ message: "ID de tarefa inválido" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const result = await db.collection("todos").deleteOne({ _id: new ObjectId(todoId) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Tarefa não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Erro ao deletar tarefa" }, { status: 500 })
  }
}
