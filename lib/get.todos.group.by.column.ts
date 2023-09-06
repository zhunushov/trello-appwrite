import { databases } from "@/appwrite";

export const getTodosGroupByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );

  const todos = data.documents;
  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }

    acc.get(todo.status)?.todos.push({
      $id: todo.$id,
      $createAt: todo.$createdAt,
      status: todo.status,
      title: todo.title,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Column>());

  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];

  for (const id of columnTypes) {
    if (!columns.has(id)) {
      columns.set(id, { id, todos: [] });
    }
  }

  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};
