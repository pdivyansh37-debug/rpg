import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { db } from './db';

/**
 * Gets the authenticated user session via Supabase SSR client.
 * Returns the corresponding database User record.
 */
export async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component context - cookies cannot be mutated
          }
        },
      },
    }
  );

  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    throw new Error('UNAUTHORIZED: Valid session required.');
  }

  // Fetch or automatically initialize internal User record with attributes
  let user = await db.user.findUnique({
    where: { authId: authUser.id },
    include: { attributes: true },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        authId: authUser.id,
        email: authUser.email ?? `hero_${authUser.id.slice(0, 6)}@liferpg.app`,
        username:
          authUser.user_metadata?.username ??
          authUser.email?.split('@')[0] ??
          `Hero_${authUser.id.slice(0, 5)}`,
        attributes: {
          create: {
            strength: 1,
            intellect: 1,
            stamina: 1,
            agility: 1,
          },
        },
      },
      include: { attributes: true },
    });
  }

  return user;
}
