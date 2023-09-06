import { useBoardStore } from "@/store/board.store";
import { useModalStore } from "@/store/modal.store";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";

type Props = {
  todos: Todo[];
  id: TypedColumn;
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const Column = ({ id, index, todos }: Props) => {
  const { searchValue, setNewTaskType } = useBoardStore((state) => state);
  const openModal = useModalStore((state) => state.openModal);

  const handleClick = () => {
    setNewTaskType(id);
    openModal();
  };
  // console.log(todos);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}>
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"
                }`}>
                <h2 className="flex justify-between font-bold text-xl p-2">
                  {idToColumnText[id]}{" "}
                  <span className="text-gray-500 bg-gray-200 rounded-full p-2 text-sm font-normal">
                    {!searchValue
                      ? todos.length
                      : todos.filter((a) =>
                          a.title
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                        ).length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (
                      searchValue &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                      return null;
                    return (
                      <Draggable
                        key={todo.$id}
                        index={index}
                        draggableId={todo.$id}>
                        {(provided) => (
                          <TodoCard
                            id={id}
                            todo={todo}
                            index={index}
                            dragHandleProps={provided.dragHandleProps}
                            draggableProps={provided.draggableProps}
                            innerRef={provided.innerRef}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}

                  <div className="flex justify-end items-end p-2">
                    <button
                      onClick={handleClick}
                      className="text-green-500 hover:text-green-600">
                      <PlusCircleIcon className="w-10 h-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
