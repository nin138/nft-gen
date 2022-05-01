import React from "react";
import {Droppable} from "react-beautiful-dnd";
import {styled} from "@mui/material";
import {DeleteIcon} from "../Icons";

const LD = styled('div')({
  width: 100,
  height: 100,
  position: "fixed",
  overflow: "hidden",
  right: 0,
  display: 'flex',
  alignItems: "center",
  justifyContent: "center",
  transition: 'all 200ms ease-in-out',
  top: 0,
  // transform: 'translateY(-60px)',
  zIndex: 2000,
})

const LID = styled('div')({
  width: 100,
  height: 100,
  background: '#333',
  overflow: "hidden",
  display: 'flex',
  alignItems: "center",
  justifyContent: "center",
})

const None = styled('div')({
  display: "none",
})


type Props = {
  dragging: boolean;
}

export const DeleteDroppable: React.FC<Props> = ({dragging}) => {
  return (
    <Droppable droppableId={'DLL'} type={'Layer'}>
      {(d1, snapshot1) => (
        <LD {...d1.droppableProps} ref={d1.innerRef}>
          <Droppable droppableId={'DLI'} type={'LayerItem'}>
            {(drop2, snapshot2) => (
              <Droppable droppableId={'DFI'} type={'FixedItem'}>
                {(drop3, snapshot3) => (
                  <div {...drop3.droppableProps} ref={drop3.innerRef}>
                    <LID {...drop2.droppableProps} ref={drop2.innerRef}
                         style={{
                           background: snapshot1.isDraggingOver || snapshot2.isDraggingOver || snapshot3.isDraggingOver ? '#a00' : undefined,
                           opacity: dragging ? 1 : 0,
                         }}>
                      <DeleteIcon fontSize={'large'}/>
                      <None>
                        {d1.placeholder}
                        {drop2.placeholder}
                        {drop3.placeholder}
                      </None>
                    </LID>
                  </div>
                )}
              </Droppable>
            )}
          </Droppable>
        </LD>
      )}
    </Droppable>
  )
}
