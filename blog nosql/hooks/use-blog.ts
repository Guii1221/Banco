"use client"

import { useState, useEffect } from "react"
import { blogStorage, type BlogPost } from "@/lib/blog-storage"

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize sample data and load posts
    blogStorage.initializeSampleData()
    setPosts(blogStorage.getAllPosts())
    setLoading(false)
  }, [])

  const createPost = (title: string, content: string, author: string) => {
    const newPost = blogStorage.createPost(title, content, author)
    setPosts(blogStorage.getAllPosts())
    return newPost
  }

  const updatePost = (id: string, updates: Partial<Pick<BlogPost, "title" | "content">>) => {
    const updatedPost = blogStorage.updatePost(id, updates)
    if (updatedPost) {
      setPosts(blogStorage.getAllPosts())
    }
    return updatedPost
  }

  const deletePost = (id: string) => {
    const success = blogStorage.deletePost(id)
    if (success) {
      setPosts(blogStorage.getAllPosts())
    }
    return success
  }

  const addComment = (postId: string, content: string, author: string, parentCommentId?: string) => {
    const newComment = blogStorage.addComment(postId, content, author, parentCommentId)
    if (newComment) {
      setPosts(blogStorage.getAllPosts())
    }
    return newComment
  }

  const deleteComment = (postId: string, commentId: string) => {
    const success = blogStorage.deleteComment(postId, commentId)
    if (success) {
      setPosts(blogStorage.getAllPosts())
    }
    return success
  }

  const exportData = () => {
    return blogStorage.exportData()
  }

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    addComment,
    deleteComment,
    exportData,
  }
}
