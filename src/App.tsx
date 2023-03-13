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
    clicked: atom(false),
    selected: atom(false),
  },
  {
    name: "Potatoes",
    clicked: atom(false),
    selected: atom(false),
  },
  {
    name: "Beans",
    clicked: atom(false),
    selected: atom(true),
  },
  {
    name: "Bacon",
    clicked: atom(false),
    selected: atom(false),
  },
];

const dataAtom = atom(initialData);
type Item = typeof initialData[number];

type ChipProps = {
  atom: Atom<Item>;
};

const Chip = ({ atom }: ChipProps) => {
  const item = useAtomValue(atom);
  const [clicked, setClicked] = useAtom(item.clicked);
  return (
    <div
      className={clsx(
        "border-2 rounded-xl px-2 cursor-pointer",
        clicked
          ? "bg-violet-200 border-violet-200 text-violet-900"
          : "bg-slate-50"
      )}
      onClick={() => setClicked((clicked) => !clicked)}
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
const selectAtoms = atom(
  (get) => get(dataAtom).filter((item) => get(item.selected) === true),
  (get, set) => {
    const items = get(unselectAtoms);
    const clickedItems = items.filter((item) => get(item.clicked) === true);
    clickedItems.forEach((item) => {
      set(item.selected, true);
      set(item.clicked, false);
    });
  }
);
const selectAtomsAtom = splitAtom(selectAtoms);

const unselectAtoms = atom(
  (get) => get(dataAtom).filter((item) => get(item.selected) === false),
  (get, set) => {
    const items = get(selectAtoms);
    const clickedItems = items.filter((item) => get(item.clicked) === true);
    clickedItems.forEach((item) => {
      set(item.selected, false);
      set(item.clicked, false);
    });
  }
);
const unselectAtomsAtom = splitAtom(unselectAtoms);

const AddButton = () => {
  const setItems = useSetAtom(selectAtoms);

  return (
    <button
      className="mt-4 border-2 px-4 py-2 rounded bg-slate-300 text-xl"
      onClick={() => {
        setItems();
      }}
    >
      Add
    </button>
  );
};

const RemoveButton = () => {
  const setItems = useSetAtom(unselectAtoms);

  return (
    <button
      className="mt-4 border-2 px-4 py-2 rounded bg-slate-300 text-xl"
      onClick={() => {
        setItems();
      }}
    >
      Remove
    </button>
  );
};

const clickAtoms = atom(null, (get, set) => {
  const items = get(unselectAtoms);
  items.forEach((item) => {
    set(item.clicked, (clicked) => !clicked);
  });
});

const ToggleSelectAll = () => {
  const setItems = useSetAtom(clickAtoms);

  return (
    <button
      className="mt-4 border-2 px-4 py-2 rounded bg-slate-300 text-xl"
      onClick={() => {
        setItems();
      }}
    >
      Toggle Select All
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
          <ChipList atoms={unselectAtomsAtom} />
        </ChipContainer>
        <ChipContainer type="selected">
          <ChipList atoms={selectAtomsAtom} />
        </ChipContainer>
      </div>
      <div className="flex flex-row justify-between">
        <div className="space-x-4">
          <AddButton />
          <ToggleSelectAll />
        </div>
        <RemoveButton />
      </div>
    </div>
  );
};

export default App;
