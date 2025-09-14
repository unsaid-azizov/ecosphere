import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminLayout } from '@/components/admin-layout';
import { EditPostClient } from './edit-post-client';

export default async function EditBlogPostPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  return (
    <AdminLayout userRole={session.user.role}>
      <div className="p-6">
        <EditPostClient />
      </div>
    </AdminLayout>
  );
}