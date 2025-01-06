import { useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { CircleUser, User } from 'lucide-react';
import Link from 'next/link';

interface Props {
  className?: string;
}

export const AdminButton: React.FC<Props> = ({ className }) => {
  const { data: session } = useSession();

  return (
    <div className={className}>
      {session && session?.user.role === 'ADMIN' &&
        <Link href="/admin/category">
          <Button variant="secondary" className="flex items-center gap-2">
            <CircleUser size={18} />
            Admin
          </Button>
        </Link>
      }
    </div>
  );
};
