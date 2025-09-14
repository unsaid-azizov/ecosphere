import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminLayout } from '@/components/admin-layout';
import { AdvancedPostEditor } from '@/components/admin/advanced-post-editor';

export default async function NewBlogPostPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  return (
    <AdminLayout userRole={session.user.role}>
      <div className="p-6">
        <AdvancedPostEditor />
      </div>
    </AdminLayout>
  );
}