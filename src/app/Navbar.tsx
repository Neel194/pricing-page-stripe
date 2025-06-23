import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-end px-4 pt-2">
      <ModeToggle />
    </nav>
  );
};
export default Navbar;
