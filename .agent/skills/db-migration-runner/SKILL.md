# Database Migration Runner Skill

Load this skill when changing the database schema, creating a new model, adding a column, adding an index, or backfilling data. Migrations are the scariest kind of change because they are the hardest to undo and they can take the app down if done wrong. Treat every schema change as a serious commit.

## The Stack

Mesxico Cakes and Nuts uses PostgreSQL managed directly via Supabase. We do not use ORM-level migration tools like Prisma. The schema and migrations live in the `supabase/migrations/` directory. Migrations are written in raw SQL and executed using the Supabase CLI.

Always ensure your local Supabase CLI version matches the team's standardized version before generating or applying migrations. Migration behavior and generated SQL can change between releases.

## The Workflow

Schema changes always follow the same sequence:

1. Run `supabase migration new <descriptive_name>` to generate a new timestamped SQL file in `supabase/migrations/`.
2. Write the raw PostgreSQL `ALTER TABLE` or `CREATE TABLE` statements in the generated file. Include explicit Row Level Security (RLS) policies for any new tables.
3. Read the SQL end to end. Do not skip this. 
4. Run the migration locally against your local Supabase instance using `supabase db reset` or `supabase db push`.
5. Run the app locally, hit the affected pages, and confirm nothing broke.
6. Commit the migration file to version control.
7. Deploy. In CI or on the deployment target, the Supabase CLI applies the migration to the remote production database.

Never edit a migration file that has already been applied anywhere. If you need to fix a mistake, write a new migration that corrects it.

## Naming

Migrations are named in snake_case, describing the change:
- `add_unique_slug_to_product`
- `add_payment_gateway_reference_index`
- `add_order_currency_column`

Good names make `git log` readable. Bad names like `update_schema` or `fix_stuff` are useless when you are reading history six months later.

## Common Schema Patterns

### Adding a nullable column (safe)

    ALTER TABLE products ADD COLUMN archived_at TIMESTAMPTZ;

Nullable columns are additive and safe. Existing rows just get `NULL`. No backfill needed.

### Adding a non-nullable column (careful)

You cannot add a `NOT NULL` column to a table with existing rows without a default or a backfill. Do it in two migrations:

1. Add the column as nullable.
2. Backfill existing rows in a data migration or application code.
3. In a second migration, set the column to `NOT NULL`.

### Adding a unique constraint

Unique constraints are how we prevent things like duplicate product slugs and duplicate payment references. They are the safety net for idempotency.

    ALTER TABLE payments ADD CONSTRAINT payments_gateway_ref_key UNIQUE (gateway_reference);

Before adding a unique constraint to an existing column with data, make sure the existing data does not already contain duplicates. The migration will fail if it does.

### Adding an index

Add an index when a query gets slow. The signal is usually a specific query in logs taking longer as the table grows. Do not speculatively index every column; each index costs write performance.

    CREATE INDEX idx_orders_created_at ON orders(created_at);

### Renaming a column (dangerous)

Standard relational databases treat renames via dropping and adding, which loses data if not handled properly. If you really need to rename, do it manually:

1. Add the new column.
2. Backfill from the old column.
3. Deploy the app reading/writing both.
4. Switch the app to the new column.
5. Drop the old column.

For Mesxico Cakes and Nuts at this stage, prefer to just pick the right name the first time. Renames are more trouble than they are worth.

## Data Migrations

Schema changes and data migrations are different. The SQL handles schema; data migrations are regular code. If you need to backfill or transform data, write a one-off script in `scripts/data-migrations/<migration-name>.ts` that uses the Supabase Admin client:

    scripts/data-migrations/
    ├── 001_add_slugs.ts
    ├── 002_backfill_order_totals.ts
    └── 003_normalize_payment_refs.ts

Invoke manually: `npx tsx scripts/data-migrations/001_add_slugs.ts`. Run this AFTER your schema migration deploys but BEFORE the code that depends on the data.

Never run ad-hoc SQL against production; always through a versioned script. After a migration script runs successfully, mark it as done by adding a `_done` suffix to the filename or moving it to an archive folder. Never delete migration scripts — they are your audit trail and are critical when reconstructing production state. Make each script idempotent where possible so accidental re-runs are safe.

## Environments

- **Development:** Use `supabase start` and `supabase db push` to iterate locally.
- **Production:** Supabase migrations are applied sequentially to the remote database using the Supabase CLI in the CI/CD pipeline. 

## Schema Drift Recovery

If the database schema changes outside of versioned SQL migrations (e.g., someone editing tables directly in the Supabase Dashboard UI), your local schema will be out of sync. To recover:

1. Run `supabase db pull` to introspect the current state of the remote database.
2. Review the generated diff. 
3. If you accept the changes, commit the pulled migration SQL as a new file.
4. If you reject the changes, manually revert the database to match your committed schema.

Never push a schema change without first confirming there is no drift.

## Rollback

Rolling forward by writing a new migration that reverses the change is the standard approach. In practice this means: before shipping a risky migration, think about how you would undo it.

For truly risky changes (dropping a column with data, transforming money amounts, changing uniqueness constraints), do the change in the order least likely to cause downtime:

1. Deploy the app with code that works against both the old and new schema.
2. Run the migration.
3. Deploy the app with code that only uses the new schema.

This is called the expand-contract pattern. Use it whenever a migration would be impossible to roll back cleanly.

## Money Columns

Amounts are stored as integers in the smallest currency unit (kobo for NGN). The PostgreSQL type is `INTEGER` or `BIGINT`, never `FLOAT` or `DECIMAL` for amounts.

If you are adding a column that holds money, its name should make the unit clear: `amount_kobo`, not `amount`. The extra few characters prevent years of bugs.

## Common Mistakes

- Editing a migration file after it has been applied somewhere. Always write a new one.
- Adding a non-nullable column to an existing table without a default or a backfill, then being surprised when the migration fails on production.
- Storing money as floats.
- Adding indexes speculatively. Indexes are not free.
- Forgetting to include Row Level Security (RLS) policies when creating a new table in Supabase.