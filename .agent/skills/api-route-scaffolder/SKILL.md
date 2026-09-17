# API Route Scaffolder Skill

Load this skill when creating or modifying a Next.js route handler (`app/api/**/route.ts`) or a server action. It tells you the exact shape every route should have in Mesxico Cakes and Nuts, so routes behave consistently whether they handle a cart checkout, stock deduction, or a webhook.

## Before You Start

Read `.agents/rules/architecture.md` and `.agents/rules/security.md`. This skill assumes you know the difference between a server action and a route handler, and it assumes you will validate input and handle errors the way those rules describe.

Ask: should this be a server action or a route handler?
- **Server action** if the caller is our own internal UI and the action is a form submit or a UI-triggered mutation (e.g., admin toggling cake availability).
- **Route handler** if the caller is a public client (guest checkout), a third party (Flutterwave webhook), or another service.

Server actions are the default for internal writes. Route handlers are for external boundaries.

## Route Handler Template

    // app/api/<resource>/<action>/route.ts

    import { NextRequest, NextResponse } from 'next/server';
    import { z } from 'zod';
    import { createClient } from '@/lib/supabase/server'; 

    const inputSchema = z.object({
      // Describe every field you expect from the client.
    });

    type Success<T> = { ok: true; data: T };
    type Failure = { ok: false; error: { code: string; message: string } };

    export async function POST(req: NextRequest) {
      try {
        // 1. Parse and validate.
        const body = await req.json().catch(() => null);
        const parsed = inputSchema.safeParse(body);
        if (!parsed.success) {
          return NextResponse.json<Failure>(
            { ok: false, error: { code: 'invalid_input', message: 'Check your input and try again.' } },
            { status: 400 }
          );
        }

        // 2. Authenticate if the route requires it (Using Supabase Auth).
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return NextResponse.json<Failure>(
            { ok: false, error: { code: 'unauthorized', message: 'Please sign in.' } },
            { status: 401 }
          );
        }

        // 3. Authorize: does this user own the resource they are trying to touch?
        //    Supabase RLS handles this at the database level, but explicit checks here prevent unnecessary DB calls.

        // 4. Do the work. Keep this block small; extract to lib/ if it gets long.
        const { data: result, error: dbError } = await supabase
            .from('table_name')
            .insert({ ...parsed.data, user_id: session.user.id })
            .select()
            .single();
            
        if (dbError) throw dbError;

        // 5. Return a structured success response.
        return NextResponse.json<Success<typeof result>>({ ok: true, data: result });
      } catch (error) {
        console.error('api.<resource>.<action>.failed', { error });
        return NextResponse.json<Failure>(
          { ok: false, error: { code: 'server_error', message: 'Something went wrong. Please try again.' } },
          { status: 500 }
        );
      }
    }

## The Rules

**Always validate with zod.** The request body, query params, and path params all come from outside and cannot be trusted. Even if TypeScript thinks it knows the shape, zod is what actually enforces it at runtime.

**Always authenticate before authorizing.** Check the session exists, then rely on Supabase Row Level Security (RLS) to enforce that the session has permission to do the thing. 

**Always return a consistent envelope.** Success is `{ ok: true, data }`. Failure is `{ ok: false, error: { code, message } }`. The client parses the same shape everywhere, which keeps error handling simple.

**Never return raw error messages.** Log the real error on the server, return a sanitized message to the client. A Supabase PostgREST error message might reveal the database schema or the structure of your query. A stack trace is even worse.

**Use proper HTTP status codes.**
- `200` for success.
- `201` for resource creation if you want to be precise.
- `400` for validation errors (client sent garbage).
- `401` for unauthenticated (no session).
- `403` for unauthorized (session exists but lacks permission).
- `404` for resource not found.
- `409` for conflicts (duplicate slug, duplicate order).
- `429` for rate limit hits.
- `500` for server errors.

**Rate limit public endpoints.** Anything reachable without a session must have a rate limit. Lean on it for login, password reset, and order creation on the public checkout page.

**Log structured data, not strings.** Structured logs can be queried; strings can only be grep'd.

## Server Action Template

    // app/(admin)/<area>/actions.ts

    'use server';

    import { z } from 'zod';
    import { revalidateTag } from 'next/cache';
    import { redirect } from 'next/navigation';
    import { createClient } from '@/lib/supabase/server';

    const inputSchema = z.object({
      // ...
    });

    type ActionResult =
      | { ok: true; data?: unknown }
      | { ok: false; error: { code: string; message: string } };

    export async function createSomething(formData: FormData): Promise<ActionResult> {
      try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return { ok: false, error: { code: 'unauthorized', message: 'Please sign in.' } };
        }

        const parsed = inputSchema.safeParse(Object.fromEntries(formData));
        if (!parsed.success) {
          return { ok: false, error: { code: 'invalid_input', message: 'Please check your entries.' } };
        }

        const { data: created, error: dbError } = await supabase
          .from('something')
          .insert({ ...parsed.data, user_id: session.user.id })
          .select()
          .single();

        if (dbError) throw dbError;

        revalidateTag('somethings');
        return { ok: true, data: created };
      } catch (error) {
        console.error('action.create_something.failed', { error });
        return { ok: false, error: { code: 'server_error', message: 'Something went wrong.' } };
      }
    }

Server actions that redirect on success do so at the end with `redirect(...)`. Actions that return data let the caller handle the response.

## Idempotency

Any route that creates something paid for must be idempotent. See `skills/flutterwave-integration/SKILL.md` for the pattern using unique constraints. Do not try to implement idempotency with application-level locking; the PostgreSQL database is the source of truth.

## Common Mistakes

- Skipping zod validation and trusting TypeScript. TypeScript does not run at runtime.
- Bypassing Row Level Security by mistakenly using the `SUPABASE_SERVICE_ROLE_KEY` in standard client requests.
- Using a `GET` for a mutation. Stick to REST conventions: `POST` creates, `PATCH` updates, `DELETE` deletes, `GET` reads.
- Returning raw Supabase errors or exception messages.
- Forgetting to `revalidateTag` or `revalidatePath` after a server action mutates data. The cache will serve stale data until you do.
- Putting heavy business logic inline in the route handler. If it is more than a few lines, move it to `lib/`.