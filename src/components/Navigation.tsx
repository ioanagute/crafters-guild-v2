import { getCurrentUser } from '@/lib/auth';
import NavigationClient from '@/components/NavigationClient';

export default async function Navigation() {
  const user = await getCurrentUser();

  return <NavigationClient isAuthenticated={Boolean(user)} />;
}
