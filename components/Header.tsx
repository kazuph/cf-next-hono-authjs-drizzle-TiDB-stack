'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function PublicNavigation() {
  const router = useRouter();

  const handleAuth = () => {
    router.push('/auth');
  };

  return (
    <>
      <nav className="hidden space-x-4 md:flex">
        <Link href="#features" className="text-gray-600 hover:text-blue-600">Features</Link>
        <Link href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
        <Link href="#contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
      </nav>
      <Button onClick={handleAuth}>ログイン / サインアップ</Button>
    </>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-white shadow-sm">
      <Link href="/" className="text-2xl font-bold text-blue-600">SaaSLogo</Link>
      <PublicNavigation />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="md:hidden">Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="#features">Features</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#pricing">Pricing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="#contact">Contact</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
