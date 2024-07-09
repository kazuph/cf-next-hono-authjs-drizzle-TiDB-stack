"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from '@hono/auth-js/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 bg-white shadow-sm">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        SaaSLogo
      </Link>
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
              <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="font-medium">
              {session.user.name || session.user.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
