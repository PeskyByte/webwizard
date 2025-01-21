"use client";

import clsx from "clsx";
import { Trash } from "lucide-react";
import { v4 } from "uuid";

import noImage from "@/components/icons/no-image.svg";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";

import Recursive from "./recursive";

type Props = { element: EditorElement };

const Container = ({ element }: Props) => {
  const { id, content, name, styles, type } = element;
  const { dispatch, state } = useEditor();

  const findContainerById = (
    elements: EditorElement[],
    elementId: string,
  ): EditorElement | null => {
    for (const el of elements) {
      if (Array.isArray(el.content)) {
        if (el.content.some((child) => child.id === elementId)) {
          return el;
        }
        const found = findContainerById(el.content, elementId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleOnDrop = (e: React.DragEvent, containerId: string) => {
    e.stopPropagation();

    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;
    const moveElementId = e.dataTransfer.getData("moveElementId");

    if (moveElementId) {
      const sourceContainer = findContainerById(
        state.editor.elements,
        moveElementId,
      );
      if (!sourceContainer) return;

      const containerRect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - containerRect.top;
      let insertIndex = 0;

      if (Array.isArray(element.content)) {
        const children = element.content;
        for (let i = 0; i < children.length; i++) {
          const child = document.getElementById(children[i].id);
          if (child) {
            const childRect = child.getBoundingClientRect();
            const childMiddle = childRect.top + childRect.height / 2;
            if (e.clientY > childMiddle) {
              insertIndex = i + 1;
            }
          }
        }
      }

      dispatch({
        type: "MOVE_ELEMENT",
        payload: {
          elementId: moveElementId,
          sourceContainerId: sourceContainer.id,
          destinationContainerId: containerId,
          destinationIndex: insertIndex,
        },
      });
      return;
    }

    switch (componentType) {
      case "text":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: "Text Element" },
              id: v4(),
              name: "Text",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "text",
            },
          },
        });
        break;
      case "link":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                innerText: "Link Element",
                href: "#",
              },
              id: v4(),
              name: "Link",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "link",
            },
          },
        });
        break;
      case "video":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: undefined,
              },
              id: v4(),
              name: "Video",
              styles: {},
              type: "video",
            },
          },
        });
        break;
      case "image":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: "",
              },
              id: v4(),
              name: "Image",
              styles: {},
              type: "image",
            },
          },
        });
        break;
      case "container":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles },
              type: "container",
            },
          },
        });
        break;
      case "contactForm":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Contact Form",
              styles: {},
              type: "contactForm",
            },
          },
        });
        break;
      case "2Col":
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
              ],
              id: v4(),
              name: "Two Columns",
              styles: { ...defaultStyles, display: "flex" },
              type: "2Col",
            },
          },
        });
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const container = e.currentTarget as HTMLElement;
    container.style.backgroundColor = "";
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;

    if (state.editor.selectedElement.id) {
      e.dataTransfer.setData("moveElementId", state.editor.selectedElement.id);
    } else {
      e.dataTransfer.setData("componentType", type);
    }
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      id={id}
      style={styles}
      className={clsx("relative p-4 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        "overflow-scroll ": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === "__body",
        "!border-solid":
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body" && !state.editor.liveMode}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, type!)}
    >
      <Badge
        className={clsx(
          "absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden",
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          },
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== "__body" && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash size={16} onClick={handleDeleteElement} />
          </div>
        )}
    </div>
  );
};

export default Container;
