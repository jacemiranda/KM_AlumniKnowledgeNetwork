import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const migrationsDir = join(process.cwd(), 'db', 'migrations');
const migrationFiles = readdirSync(migrationsDir).filter((file) =>
  file.endsWith('.sql'),
);
const migrationSql = migrationFiles
  .map((file) => readFileSync(join(migrationsDir, file), 'utf8'))
  .join('\n')
  .toLowerCase();

describe('Sprint 1 PR-02 schema migrations', () => {
  it.each([
    'profiles',
    'fields',
    'skills',
    'profile_skills',
    'posts',
    'tags',
    'post_tags',
    'comments',
    'votes',
  ])('creates the %s table', (tableName) => {
    expect(migrationSql).toContain(`create table if not exists public.${tableName}`);
  });

  it.each(['badges', 'user_badges', 'notifications'])(
    'leaves the later-sprint %s table out of current migrations',
    (tableName) => {
      expect(migrationSql).not.toContain(
        `create table if not exists public.${tableName}`,
      );
    },
  );

  it('does not include later-sprint leaderboard, analytics, voting, or badge automation', () => {
    expect(migrationSql).not.toContain('v_user_authority_leaderboard');
    expect(migrationSql).not.toContain('v_basic_platform_analytics');
    expect(migrationSql).not.toContain('refresh_profile_authority_score');
    expect(migrationSql).not.toContain('award_eligible_badges');
  });

  it('allows first-time OAuth profiles to exist before setup completion', () => {
    expect(migrationSql).toContain("name text not null default ''");
    expect(migrationSql).not.toContain('profiles_name_check');
  });

  it('does not keep the removed community approval workflow migration', () => {
    expect(migrationFiles).not.toContain('002_community_approval_workflow.sql');
  });
});
