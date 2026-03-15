import { createClient } from '@/utils/supabase/server';
import NavigationClient from '@/components/NavigationClient';

export default async function Navigation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <NavigationClient isAuthenticated={Boolean(user)} />;
}
