import { navItem } from "@/constants";
import Link from "next/link";
const Navbar = () => {
  return (
    <article className="max-w-7xl mx-auto grid grid-cols-3 place-items-center px-10 py-10 bg-transparent fixed top-0 inset-x-0 z-50 backdrop-blur-xl">
      <div>
        <Link href={"/"}>
          <h1 className="font-instrument text-3xl font-bold ">Clarity</h1>
        </Link>
      </div>
      <div>
        <ul className="flex gap-5">
          {navItem.map(({ title, key }) => (
            <Link href={key} key={key}>
              {title}
            </Link>
          ))}
        </ul>
      </div>
      <div className="flex gap-4">
        <Link href={"/login"}>
          <button className="border-[0.5px] border-light/10 bg-[#1b1c1b] text-light">
            Sign In
          </button>
        </Link>
        <Link href={"/register"}>
          <button className="">Sign Up</button>
        </Link>
      </div>
    </article>
  );
};

export default Navbar;
