import { Mooli } from 'next/font/google'
import Link from "next/link";

const mooli = Mooli({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mooli",
});

export default function ShikelaLogo() {
  return (
    <div>
      <h1 className={`${mooli.className} text-[28px] select-none`}>
        <Link href="/" className="text-foreground">
          Shikela
        </Link>
      </h1>
    </div>
  );
}
