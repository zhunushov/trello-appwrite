"use client";

import { useBoardStore } from "@/store/board.store";
import { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Column from "./Column";

const Board = () => {
  const { board, getBoard, setBoardState, updateTodoInDB } = useBoardStore(
    (state) => state
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const removed = entries.splice(source.index, 1)[0];
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    const column = Array.from(board.columns.entries());
    const startColElem = column[Number(source.droppableId)];
    const endColIElem = column[Number(destination.droppableId)];

    const startColObj: Column = {
      id: startColElem ? startColElem[0] : "todo",
      todos: startColElem ? startColElem[1].todos : [],
    };
    const endColObj: Column = {
      id: endColIElem ? endColIElem[0] : "done",
      todos: endColIElem ? endColIElem[1].todos : [],
    };

    const newTodos = startColObj.todos;
    const changeElem = newTodos.splice(source.index, 1)[0];

    if (startColObj.id === endColObj.id) {
      newTodos.splice(destination.index, 0, changeElem);
      const newCol = {
        id: startColObj.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);

      newColumns.set(newCol.id, newCol);
      setBoardState({
        ...board,
        columns: newColumns,
      });
    } else {
      if (destination.droppableId === "board") return;
      const endTodos = Array.from(endColObj.todos);
      endTodos.splice(destination.index, 0, changeElem);

      const newStartCol = {
        id: startColObj.id,
        todos: newTodos,
      };
      const newEndCol = {
        id: endColObj.id,
        todos: endTodos,
      };

      const newColumns = new Map(board.columns);

      newColumns.set(newStartCol.id, newStartCol);
      newColumns.set(newEndCol.id, newEndCol);

      updateTodoInDB(changeElem, endColObj.id);
      setBoardState({
        ...board,
        columns: newColumns,
      });
    }
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {Array.from(board.columns.entries()).map(([id, col], index) => (
              <Column key={id} id={id} todos={col.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
