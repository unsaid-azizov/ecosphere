import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminLayout } from '@/components/admin-layout';
import { BlogManagement } from './blog-management';

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  return (
    <AdminLayout userRole={session.user.role}>
      <div className="p-6">
        <BlogManagement />
      </div>
    </AdminLayout>
  );
}