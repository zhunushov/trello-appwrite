"use client";

import getUrl from "@/lib/get.url";
import { useBoardStore } from "@/store/board.store";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (el: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};
const TodoCard = ({
  id,
  todo,
  index,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) => {
  const deleteTodo = useBoardStore((store) => store.deleteTodo);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
    return () => {};
  }, [todo]);

  const handleDelete = () => {
    deleteTodo(index, todo, id);
  };

  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}>
      <div className="flex items-center justify-between p-5">
        <p className="">{todo.title}</p>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600">
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>
      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Todo Image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
};

export default TodoCard;
