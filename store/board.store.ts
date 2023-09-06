import { databases, storage, ID } from "@/appwrite";
import { getTodosGroupByColumn } from "@/lib/get.todos.group.by.column";
import uploadImage from "@/lib/upload.image";
import { create } from "zustand";

interface BoardState {
  board: Board;
  image: File | null;
  searchValue: string;
  newTaskValue: string;
  newTaskType: TypedColumn;
  getBoard: () => void;
  setImage: (file: File | null) => void;
  addTodo: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  setSearchValue: (e: string) => void;
  setNewTaskValue: (e: string) => void;
  setNewTaskType: (e: TypedColumn) => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  deleteTodo: (todoIndex: number, todo: Todo, id: TypedColumn) => void;
}
export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  newTaskType: "todo",
  searchValue: "",
  newTaskValue: "",
  image: null,
  setImage: (file) => set({ image: file }),
  setNewTaskType: (newTaskType: TypedColumn) => set({ newTaskType }),
  setSearchValue: (searchValue) => set({ searchValue }),
  setNewTaskValue: (newTaskValue) => set({ newTaskValue }),

  getBoard: async () => {
    const board = await getTodosGroupByColumn();
    set({
      board,
    });
  },
  async addTodo(todo, columnId, image?) {
    let file: Image | undefined;
    console.log(file, image);

    if (image) {
      try {
        const fileUploaded = await uploadImage(image);
        if (fileUploaded) {
          file = {
            bucketId: fileUploaded.bucketId,
            fileId: fileUploaded.$id,
          };
        }
      } catch (error) {
        console.log(error);
      }
    }
    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskValue: "" });
    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        title: todo,
        status: columnId,
        $createAt: new Date().toISOString(),
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  async deleteTodo(todoIndex, todo, id) {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(todoIndex, 1);

    set({
      board: {
        columns: newColumns,
      },
    });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },

  setBoardState: (board) => set({ board }),
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
}));
