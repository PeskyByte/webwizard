"use client";

import { FunnelPage } from "@prisma/client";
import { Dispatch, createContext, useContext, useReducer } from "react";

import { EditorBtns } from "@/lib/constants";

import { EditorAction } from "./editor-actions";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content:
    | EditorElement[]
    | {
        href?: string;
        innerText?: string;
        src?: string;
        csrc1?: string;
        csrc2?: string;
        csrc3?: string;
        at1?: string;
        at2?: string;
        at3?: string;
        ac1?: string;
        ac2?: string;
        ac3?: string;
        productId?: string;
      };
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  previewMode: boolean;
  funnelPageId: string;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: EditorState["editor"] = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
  },
  device: "Desktop",
  previewMode: false,
  liveMode: false,
  funnelPageId: "",
};

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

const moveElement = (
  editorArray: EditorElement[],
  action: EditorAction,
): EditorElement[] => {
  if (action.type !== "MOVE_ELEMENT") {
    throw Error("You sent the wrong action type to the Move Element State");
  }

  const {
    elementId,
    sourceContainerId,
    destinationContainerId,
    destinationIndex,
  } = action.payload;

  let elementToMove: EditorElement | null = null;
  let sourceArray: EditorElement[] = [];
  let sourceIndex: number = -1;

  const findElement = (array: EditorElement[], containerId: string): void => {
    array.forEach((item, _) => {
      if (item.id === containerId && Array.isArray(item.content)) {
        item.content.forEach((child, childIndex) => {
          if (child.id === elementId) {
            elementToMove = child;
            sourceArray = item.content as EditorElement[];
            sourceIndex = childIndex;
          }
        });
      }
      if (item.content && Array.isArray(item.content)) {
        findElement(item.content, containerId);
      }
    });
  };

  findElement(editorArray, sourceContainerId);

  if (!elementToMove || !sourceArray) {
    return editorArray;
  }

  sourceArray.splice(sourceIndex, 1);

  const insertElement = (
    array: EditorElement[],
    containerId: string,
  ): boolean => {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (item.id === containerId && Array.isArray(item.content)) {
        item.content.splice(destinationIndex, 0, elementToMove!);
        return true;
      }
      if (item.content && Array.isArray(item.content)) {
        if (insertElement(item.content, containerId)) {
          return true;
        }
      }
    }
    return false;
  };

  insertElement(editorArray, destinationContainerId);

  return [...editorArray];
};

const addAnElement = (
  editorArray: EditorElement[],
  action: EditorAction,
): EditorElement[] => {
  if (action.type !== "ADD_ELEMENT")
    throw Error(
      "You sent the wrong action type to the Add Element editor State",
    );
  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      };
    }
    return item;
  });
};

const updateAnElement = (
  editorArray: EditorElement[],
  action: EditorAction,
): EditorElement[] => {
  if (action.type !== "UPDATE_ELEMENT") {
    throw Error("You sent the wrong action type to the update Element State");
  }
  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return { ...item, ...action.payload.elementDetails };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateAnElement(item.content, action),
      };
    }
    return item;
  });
};

const deleteAnElement = (
  editorArray: EditorElement[],
  action: EditorAction,
): EditorElement[] => {
  if (action.type !== "DELETE_ELEMENT")
    throw Error(
      "You sent the wrong action type to the Delete Element editor State",
    );
  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false;
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteAnElement(item.content, action);
    }
    return true;
  });
};

const editorReducer = (
  state: EditorState = initialState,
  action: EditorAction,
): EditorState => {
  switch (action.type) {
    case "MOVE_ELEMENT": {
      const updatedEditorState = {
        ...state.editor,
        elements: moveElement(state.editor.elements, action),
      };

      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState },
      ];

      return {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      };
    }

    case "ADD_ELEMENT":
      const updatedEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      };

      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState },
      ];

      return {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      };

    case "UPDATE_ELEMENT":
      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updateAnElement(state.editor.elements, action),
        selectedElement:
          state.editor.selectedElement.id === action.payload.elementDetails.id
            ? action.payload.elementDetails
            : {
                id: "",
                content: [],
                name: "",
                styles: {},
                type: null,
              },
      };

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate },
      ];

      return {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      };

    case "DELETE_ELEMENT":
      const updatedEditorStateAfterDelete = {
        ...state.editor,
        elements: deleteAnElement(state.editor.elements, action),
      };

      const updatedHistoryAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateAfterDelete },
      ];

      return {
        ...state,
        editor: updatedEditorStateAfterDelete,
        history: {
          ...state.history,
          history: updatedHistoryAfterDelete,
          currentIndex: updatedHistoryAfterDelete.length - 1,
        },
      };

    case "CHANGE_CLICKED_ELEMENT":
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedElement:
            state.editor.selectedElement.id ===
            action.payload.elementDetails?.id
              ? {
                  id: "",
                  content: [],
                  name: "",
                  styles: {},
                  type: null,
                }
              : action.payload.elementDetails || {
                  id: "",
                  content: [],
                  name: "",
                  styles: {},
                  type: null,
                },
        },
        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor }, // Save a copy of the current editor state
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      };

    case "CHANGE_DEVICE":
      return {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      };

    case "TOGGLE_PREVIEW_MODE":
      return {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      };

    case "TOGGLE_LIVE_MODE":
      return {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload
            ? action.payload.value
            : !state.editor.liveMode,
        },
      };

    case "REDO":
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };
        return redoState;
      }
      return state;

    case "UNDO":
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1;
        const prevEditorState = { ...state.history.history[prevIndex] };
        const undoState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        };
        return undoState;
      }
      return state;

    case "LOAD_DATA":
      return {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: action.payload.elements || initialEditorState.elements,
          liveMode: !!action.payload.withLive,
        },
      };

    case "SET_FUNNELPAGE_ID":
      const { funnelPageId } = action.payload;
      const updatedEditorStateWithFunnelPageId = {
        ...state.editor,
        funnelPageId,
      };

      const updatedHistoryWithFunnelPageId = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithFunnelPageId },
      ];

      return {
        ...state,
        editor: updatedEditorStateWithFunnelPageId,
        history: {
          ...state.history,
          history: updatedHistoryWithFunnelPageId,
          currentIndex: updatedHistoryWithFunnelPageId.length - 1,
        },
      };

    default:
      return state;
  }
};

export type EditorContextData = {
  device: DeviceTypes;
  previewMode: boolean;
  setPreviewMode: (previewMode: boolean) => void;
  setDevice: (device: DeviceTypes) => void;
};

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
}>({
  state: initialState,
  dispatch: () => undefined,
  subaccountId: "",
  funnelId: "",
  pageDetails: null,
});

type EditorProps = {
  children: React.ReactNode;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage;
};

const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        subaccountId: props.subaccountId,
        funnelId: props.funnelId,
        pageDetails: props.pageDetails,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor Hook must be used within the editor Provider");
  }
  return context;
};

export default EditorProvider;
