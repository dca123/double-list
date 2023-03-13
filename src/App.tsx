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

const initialData = [
  {
    name: "Carrots",
    clicked: false,
    selected: false,
  },
  {
    name: "Potatoes",
    clicked: false,
    selected: false,
  },
  {
    name: "Beans",
    clicked: false,
    selected: true,
  },
  {
    name: "Bacon",
    clicked: false,
    selected: false,
  },
];

const dataAtom = atom(initialData);
type Item = typeof initialData[number];

type ChipProps = {
  atom: PrimitiveAtom<Item>;
};

const Chip = ({ atom }: ChipProps) => {
  const [item, setItem] = useAtom(atom);
  return (
    <div
      className={clsx(
        "border-2 rounded-xl px-2 cursor-pointer",
        item.clicked
          ? "bg-violet-200 border-violet-200 text-violet-900"
          : "bg-slate-50"
      )}
      onClick={() => setItem({ ...item, clicked: !item.clicked })}
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
      <h2 className="text-xl mb-4">{title}</h2>
      <div className="grid grid-cols-5 gap-2">{children}</div>
    </div>
  );
};

type ChipListProps = {
  atoms: typeof selectAtomsAtom | typeof unselectAtomsAtom;
};

const ChipList = ({ atoms }: ChipListProps) => {
  const items = useAtomValue(atoms);
  return (
    <>
      {items.map((item) => (
        <Chip atom={item} key={`${item.toString()}`} />
      ))}
    </>
  );
};
const selectAtoms = focusAtom(dataAtom, (optic) =>
  optic.filter((item) => item.selected === true)
);
const selectAtomsAtom = splitAtom(selectAtoms);

const unselectAtoms = focusAtom(dataAtom, (optic) =>
  optic.filter((item) => item.selected === false)
);
const unselectAtomsAtom = splitAtom(unselectAtoms);

const AddButton = () => {
  const setItems = useSetAtom(dataAtom);

  return (
    <button
      className="mt-4 border-2 px-4 py-2 rounded bg-slate-300 text-xl"
      onClick={() => {
        setItems((items) => {
          return items.map((item) => {
            if (item.clicked) {
              return {
                ...item,
                selected: true,
              };
            }
            return item;
          });
        });
      }}
    >
      Add
    </button>
  );
};

const RemoveButton = () => {
  const setItems = useSetAtom(dataAtom);

  return (
    <button
      className="mt-4 border-2 px-4 py-2 rounded bg-slate-300 text-xl"
      onClick={() => {
        setItems((items) => {
          return items.map((item) => {
            if (item.clicked) {
              return {
                ...item,
                selected: false,
              };
            }
            return item;
          });
        });
      }}
    >
      Remove
    </button>
  );
};

const SelectAll = () => {
  const setItems = useSetAtom(dataAtom);

  return (
    <button
      className="mt-4 border-2 px-4 py-2 rounded bg-slate-300 text-xl"
      onClick={() => {
        setItems((items) => {
          return items.map((item) => {
            if (item.selected === false) {
              return {
                ...item,
                selected: false,
              };
            }
            return item;
          });
        });
      }}
    >
      Select All
    </button>
  );
};

const App = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl mb-8">Double List</h1>
      <div className="flex flex-row space-x-4 justify-between">
        <ChipContainer type="unselected">
          <ChipList atoms={unselectAtomsAtom} />
        </ChipContainer>
        <ChipContainer type="selected">
          <ChipList atoms={selectAtomsAtom} />
        </ChipContainer>
      </div>
      <div className="flex flex-row justify-between">
        <div className="space-x-4">
          <AddButton />
          <SelectAll />
        </div>
        <RemoveButton />
      </div>
    </div>
  );
};

export default App;
