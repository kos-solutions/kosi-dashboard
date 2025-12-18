import ChildSelector from "./ChildSelector";

export default function Header() {
  return (
    <header className="bg-white border-b px-6 h-14 flex items-center justify-between">
      <span className="font-semibold">KOSI</span>
      <ChildSelector />
    </header>
  );
}
