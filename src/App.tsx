import { useState } from "react";
import reactLogo from "./assets/react.svg";
import {
  Atom,
  atom,
  PrimitiveAtom,
  useAtom,
  useAtomValue,
  useSetAtom,
} from "jotai";
import { selectAtom, splitAtom } from "jotai/utils";
import { focusAtom } from "jotai-optics";
import { clsx } from "clsx";
import type { OpticFor } from "optics-ts";
import { DevTools } from "jotai-devtools";

const initialData = [
  {
    name: "Carrots",
  },
  {
    name: "Potatoes",
  },
  {
    name: "Beans",
  },
  {
    name: "Bacon",
  },
];
const itemsAtoms = atom(initialData);
const itemAtomsAtom = splitAtom(itemsAtoms);

type Item = typeof initialData[number];

type ChipProps = {
  atom: Atom<Item>;
  removeItem: () => void;
};

const Chip = ({ atom, removeItem }: ChipProps) => {
  const item = useAtomValue(atom);
  return (
    <div
      className={clsx("border-2 rounded-xl px-2 cursor-pointer")}
      onClick={() => removeItem()}
    >
      {item.name}
    </div>
  );
};

type ChipContainerProps = {
  type: "selected" | "unselected";
  children: React.ReactNode;
};

const ChipContainer = ({ type, children }: ChipContainerProps) => {
  const title = type === "selected" ? "Selected" : "Unselected";
  return (
    <div className="border-2 p-4 rounded">
      <h2 className="text-xl mb-4">Items (Click to remove)</h2>
      <div className="grid grid-cols-5 gap-2">{children}</div>
    </div>
  );
};

type ChipListProps = {};

const ChipList = ({}: ChipListProps) => {
  const [items, dispatch] = useAtom(itemAtomsAtom);
  return (
    <>
      {items.map((item) => (
        <Chip
          atom={item}
          key={`${item.toString()}`}
          removeItem={() => dispatch({ type: "remove", atom: item })}
        />
      ))}
    </>
  );
};

const AddButton = () => {
  const setItems = useSetAtom(itemAtomsAtom);

  return (
    <button
      className="mt-4 border-2 px-4 py-2 rounded bg-slate-300 text-xl"
      onClick={() => {
        setItems({
          type: "insert",
          value: {
            name: "New Item",
          },
        });
      }}
    >
      Add
    </button>
  );
};

const App = () => {
  return (
    <div className="container mx-auto">
      {/* <DevTools /> */}
      <h1 className="text-3xl mb-8">Double List</h1>
      <div className="flex flex-row space-x-4 justify-between">
        <ChipContainer type="unselected">
          <ChipList />
        </ChipContainer>
      </div>
      <div className="flex flex-row justify-between">
        <div className="space-x-4">
          <AddButton />
        </div>
      </div>
    </div>
  );
};

export default App;
