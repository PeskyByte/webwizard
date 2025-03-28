"use client";

import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  ChevronsLeftRightIcon,
  LucideImageDown,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor/editor-provider";

type Props = {};

const SettingsTab = (props: Props) => {
  const { state, dispatch } = useEditor();

  const handleOnChanges = (e: any) => {
    const styleSettings = e.target.id;
    let value = e.target.value;
    const styleObject = {
      [styleSettings]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    });
  };

  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id;
    let value = e.target.value;
    const styleObject = {
      [settingProperty]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    });
  };

  return (
    <Accordion
      type="multiple"
      className="w-full h-full"
      defaultValue={["Typography", "Dimensions", "Decorations", "Flexbox"]}
    >
      <AccordionItem value="Custom" className="px-6 py-0  ">
        <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
        <AccordionContent>
          {state.editor.selectedElement.type === "link" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Link Path</p>
                <Input
                  id="href"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.href}
                />
                <p className="text-muted-foreground">Link Text</p>
                <Input
                  id="innerText"
                  placeholder="Text"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.innerText}
                />
              </div>
            )}
          {(state.editor.selectedElement.type === "image" ||
            state.editor.selectedElement.type === "video") &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Path</p>
                <Input
                  id="src"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.src}
                />
              </div>
            )}
          {state.editor.selectedElement.type === "carousel" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Images Paths</p>
                <Input
                  id="csrc1"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.csrc1}
                />
                <Input
                  id="csrc2"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.csrc2}
                />
                <Input
                  id="csrc3"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.csrc3}
                />
              </div>
            )}
          {state.editor.selectedElement.type === "accordion" &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Headers</p>
                <Input
                  id="at1"
                  placeholder="first header"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.at1}
                />
                <Input
                  id="at2"
                  placeholder="second header"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.at2}
                />
                <Input
                  id="at3"
                  placeholder="third header"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.at3}
                />
                <p className="text-muted-foreground">content</p>
                <Input
                  id="ac1"
                  placeholder="first content"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.ac1}
                />
                <Input
                  id="ac2"
                  placeholder="second content"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.ac2}
                />
                <Input
                  id="ac3"
                  placeholder="third content"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.ac3}
                />
              </div>
            )}
        </AccordionContent>
      </AccordionItem>
      {state.editor.selectedElement.type !== "container" &&
        state.editor.selectedElement.type !== "2Col" && (
          <AccordionItem
            value="Typography"
            className="px-6 py-0  border-y-[1px]"
          >
            <AccordionTrigger className="!no-underline">
              Typography
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 ">
              <div className="flex flex-col gap-2 ">
                <p className="text-muted-foreground">Text Align</p>
                <Tabs
                  onValueChange={(e) =>
                    handleOnChanges({
                      target: {
                        id: "textAlign",
                        value: e,
                      },
                    })
                  }
                  value={state.editor.selectedElement.styles.textAlign}
                >
                  <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                    <TabsTrigger
                      value="left"
                      className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                    >
                      <AlignLeft size={18} />
                    </TabsTrigger>
                    <TabsTrigger
                      value="right"
                      className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                    >
                      <AlignRight size={18} />
                    </TabsTrigger>
                    <TabsTrigger
                      value="center"
                      className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                    >
                      <AlignCenter size={18} />
                    </TabsTrigger>
                    <TabsTrigger
                      value="justify"
                      className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                    >
                      <AlignJustify size={18} />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Font Family</p>
                <Input
                  id="fontFamily"
                  onChange={handleOnChanges}
                  value={state.editor.selectedElement.styles.fontFamily}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Color</p>
                <Input
                  id="color"
                  onChange={handleOnChanges}
                  value={state.editor.selectedElement.styles.color}
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <Label className="text-muted-foreground">Weight</Label>
                  <Select
                    onValueChange={(e) =>
                      handleOnChanges({
                        target: {
                          id: "font-weight",
                          value: e,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Font Weights</SelectLabel>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="normal">Regular</SelectItem>
                        <SelectItem value="lighter">Light</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground">Size</Label>
                  <Input
                    placeholder="px"
                    id="fontSize"
                    onChange={handleOnChanges}
                    value={state.editor.selectedElement.styles.fontSize}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      <AccordionItem value="Dimensions" className=" px-6 py-0 ">
        <AccordionTrigger className="!no-underline">
          Dimensions
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Height</Label>
                    <Input
                      id="height"
                      placeholder="px, rem"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.height}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Width</Label>
                    <Input
                      placeholder="px, rem"
                      id="width"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.width}
                    />
                  </div>
                </div>
              </div>
              <p>Margin</p>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      id="marginTop"
                      placeholder="px, rem"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginTop}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px, rem"
                      id="marginBottom"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginBottom}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px, rem"
                      id="marginLeft"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginLeft}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px, rem"
                      id="marginRight"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginRight}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Padding</p>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      placeholder="px, rem"
                      id="paddingTop"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingTop}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px, rem"
                      id="paddingBottom"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingBottom}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px, rem"
                      id="paddingLeft"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingLeft}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px, rem"
                      id="paddingRight"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingRight}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Decorations" className="px-6 py-0 ">
        <AccordionTrigger className="!no-underline">
          Decorations
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <div>
            <Label className="text-muted-foreground">Opacity</Label>
            <div className="flex items-center justify-end">
              <small className="p-2">
                {typeof state.editor.selectedElement.styles?.opacity ===
                "number"
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.opacity || "0"
                      ).replace("%", ""),
                    ) || 0}
                %
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: "opacity",
                    value: `${e[0]}%`,
                  },
                });
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.opacity === "number"
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.opacity || "0"
                      ).replace("%", ""),
                    ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Border Radius</Label>
            <div className="flex items-center justify-end">
              <small className="">
                {typeof state.editor.selectedElement.styles?.borderRadius ===
                "number"
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.borderRadius || "0"
                      ).replace("px", ""),
                    ) || 0}
                px
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: "borderRadius",
                    value: `${e[0]}px`,
                  },
                });
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.borderRadius ===
                "number"
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                      (
                        state.editor.selectedElement.styles?.borderRadius || "0"
                      ).replace("%", ""),
                    ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Color</Label>
            <div className="flex  border-[1px] rounded-md overflow-clip">
              <div
                className="w-12 "
                style={{
                  backgroundColor:
                    state.editor.selectedElement.styles.backgroundColor,
                }}
              />
              <Input
                placeholder="#HFI245"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="backgroundColor"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.backgroundColor}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Image</Label>
            <div className="flex  border-[1px] rounded-md overflow-clip">
              <div
                className="w-12 "
                style={{
                  backgroundImage:
                    state.editor.selectedElement.styles.backgroundImage,
                }}
              />
              <Input
                placeholder="url()"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="backgroundImage"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.backgroundImage}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Image Position</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: "backgroundSize",
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.backgroundSize?.toString()}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TabsTrigger
                  value="cover"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <ChevronsLeftRightIcon size={18} />
                </TabsTrigger>
                <TabsTrigger
                  value="contain"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <AlignVerticalJustifyCenter size={22} />
                </TabsTrigger>
                <TabsTrigger
                  value="auto"
                  className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                >
                  <LucideImageDown size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="Flexbox" className="px-6 py-0  ">
        <AccordionTrigger className="!no-underline">Flexbox</AccordionTrigger>
        <AccordionContent>
          <Label className="text-muted-foreground">Justify Content</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: "justifyContent",
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.justifyContent}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              <TabsTrigger
                value="space-between"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignHorizontalSpaceBetween size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="space-evenly"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignHorizontalSpaceAround size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="center"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignHorizontalJustifyCenterIcon size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="start"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
              >
                <AlignHorizontalJustifyStart size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="end"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
              >
                <AlignHorizontalJustifyEndIcon size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Label className="text-muted-foreground">Align Items</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: "alignItems",
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.alignItems}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              <TabsTrigger
                value="center"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
              >
                <AlignVerticalJustifyCenter size={18} />
              </TabsTrigger>
              <TabsTrigger
                value="normal"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
              >
                <AlignVerticalJustifyStart size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Input
              className="h-4 w-4"
              placeholder="px"
              type="checkbox"
              id="display"
              onChange={(va) => {
                handleOnChanges({
                  target: {
                    id: "display",
                    value: va.target.checked ? "flex" : "block",
                  },
                });
              }}
            />
            <Label className="text-muted-foreground">Flex</Label>
          </div>
          <div>
            <Label className="text-muted-foreground"> Direction</Label>
            <Input
              placeholder="px"
              id="flexDirection"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.flexDirection}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SettingsTab;
