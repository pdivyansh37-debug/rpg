-- ============================================================================
-- LIFE RPG: SUPABASE POSTGRESQL DATABASE SCHEMA & DATA ISOLATION
-- Project URL: https://vdozekkkbypwrbecauta.supabase.co
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE (Hero Profile, Levels, Economy)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- Maps directly to auth.users.id
    username VARCHAR(100) NOT NULL DEFAULT 'Nexus Operator',
    class_title VARCHAR(100) NOT NULL DEFAULT 'CHRONO-KNIGHT',
    specialization VARCHAR(150) DEFAULT 'Cyber-Focus Kinetic Synthesis',
    level INT NOT NULL DEFAULT 1,
    hp INT NOT NULL DEFAULT 800,
    max_hp INT NOT NULL DEFAULT 800,
    xp INT NOT NULL DEFAULT 0,
    next_level_xp INT NOT NULL DEFAULT 100,
    total_xp INT NOT NULL DEFAULT 0,
    gold INT NOT NULL DEFAULT 0,
    cyber_shards INT NOT NULL DEFAULT 0,
    streak_count INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    unspent_skill_points INT NOT NULL DEFAULT 0,
    is_overclocked BOOLEAN NOT NULL DEFAULT FALSE,
    vitality_bonus NUMERIC(4, 1) DEFAULT 10.0,
    surge_bonus NUMERIC(4, 1) DEFAULT 10.0,
    strike_latency INT DEFAULT 35,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. USER ATTRIBUTES (6-Axis Radar Matrix)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    str INT NOT NULL DEFAULT 10,
    intellect INT NOT NULL DEFAULT 10,
    sta INT NOT NULL DEFAULT 10,
    agi INT NOT NULL DEFAULT 10,
    syn INT NOT NULL DEFAULT 10,
    void INT NOT NULL DEFAULT 10,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ----------------------------------------------------------------------------
-- 3. QUESTS TABLE (Daily Rituals, Tasks & Boss Gates)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- TRIVIAL, EASY, MEDIUM, HARD
    attribute_type VARCHAR(20) NOT NULL DEFAULT 'INTELLECT', -- STRENGTH, INTELLECT, STAMINA, AGILITY, SYNERGY, VOID
    xp_reward INT NOT NULL DEFAULT 50,
    gold_reward INT NOT NULL DEFAULT 20,
    streak_bonus INT NOT NULL DEFAULT 2,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_string VARCHAR(50),
    protocol_type VARCHAR(100),
    meta_badge VARCHAR(50),
    is_boss BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. HABITS TABLE (+/- Trackers)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    notes TEXT,
    is_positive BOOLEAN NOT NULL DEFAULT TRUE,
    is_negative BOOLEAN NOT NULL DEFAULT FALSE,
    positive_count INT NOT NULL DEFAULT 0,
    negative_count INT NOT NULL DEFAULT 0,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    attribute_type VARCHAR(20) NOT NULL DEFAULT 'INTELLECT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. DAILIES TABLE (Recurring Rituals)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dailies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    notes TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    streak INT NOT NULL DEFAULT 0,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'EASY',
    attribute_type VARCHAR(20) NOT NULL DEFAULT 'STAMINA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. TODOS TABLE (Single Tasks / Bounties)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    notes TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    due_date VARCHAR(50),
    difficulty VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    attribute_type VARCHAR(20) NOT NULL DEFAULT 'AGILITY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. ITEMS CATALOG & INVENTORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- GEAR, CODES, CONSUMABLE, TITLES
    cost_gold INT NOT NULL DEFAULT 0,
    cost_shards INT NOT NULL DEFAULT 0,
    rarity VARCHAR(20) NOT NULL DEFAULT 'RARE', -- COMMON, RARE, EPIC, LEGENDARY
    stat_bonus VARCHAR(100),
    icon_emoji VARCHAR(10),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- ----------------------------------------------------------------------------
-- 8. STRICT ROW LEVEL SECURITY (RLS) POLICIES FOR USER DATA ISOLATION
-- ----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE dailies ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Drop any previous permissive demo policies
DROP POLICY IF EXISTS "Public Read Users" ON users;
DROP POLICY IF EXISTS "Public Insert Users" ON users;
DROP POLICY IF EXISTS "Public Update Users" ON users;
DROP POLICY IF EXISTS "Public Read Attributes" ON user_attributes;
DROP POLICY IF EXISTS "Public Insert Attributes" ON user_attributes;
DROP POLICY IF EXISTS "Public Update Attributes" ON user_attributes;
DROP POLICY IF EXISTS "Public Read Quests" ON quests;
DROP POLICY IF EXISTS "Public Insert Quests" ON quests;
DROP POLICY IF EXISTS "Public Update Quests" ON quests;
DROP POLICY IF EXISTS "Public Delete Quests" ON quests;
DROP POLICY IF EXISTS "Public Read Items" ON items;
DROP POLICY IF EXISTS "Public Read Inventory" ON inventory;
DROP POLICY IF EXISTS "Public Insert Inventory" ON inventory;

-- Users Isolation Policies
CREATE POLICY "Users can select own profile" ON users FOR SELECT USING (auth.uid() = id OR auth.uid() IS NULL);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Attributes Isolation Policies
CREATE POLICY "Users can select own attributes" ON user_attributes FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can insert own attributes" ON user_attributes FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own attributes" ON user_attributes FOR UPDATE USING (auth.uid() = user_id);

-- Quests Isolation Policies
CREATE POLICY "Users can select own quests" ON quests FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can insert own quests" ON quests FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own quests" ON quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quests" ON quests FOR DELETE USING (auth.uid() = user_id);

-- Habits Isolation Policies
CREATE POLICY "Users can select own habits" ON habits FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can insert own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- Dailies Isolation Policies
CREATE POLICY "Users can select own dailies" ON dailies FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can insert own dailies" ON dailies FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own dailies" ON dailies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own dailies" ON dailies FOR DELETE USING (auth.uid() = user_id);

-- Todos Isolation Policies
CREATE POLICY "Users can select own todos" ON todos FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can insert own todos" ON todos FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own todos" ON todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own todos" ON todos FOR DELETE USING (auth.uid() = user_id);

-- Items (Public Catalog)
CREATE POLICY "Anyone can view items catalog" ON items FOR SELECT USING (true);

-- Inventory Isolation Policies
CREATE POLICY "Users can select own inventory" ON inventory FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can insert own inventory" ON inventory FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own inventory" ON inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own inventory" ON inventory FOR DELETE USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 9. AUTOMATIC NEW USER PROVISIONING TRIGGER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Insert initial User profile
  INSERT INTO public.users (id, username, class_title, specialization, level, hp, max_hp, xp, next_level_xp, total_xp, gold, cyber_shards, streak_count, unspent_skill_points)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'Nexus Operator'),
    'CHRONO-KNIGHT',
    'Cyber-Focus Kinetic Synthesis',
    1, 800, 800, 0, 100, 0, 0, 0, 0, 0
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Insert initial Attributes
  INSERT INTO public.user_attributes (user_id, str, intellect, sta, agi, syn, void)
  VALUES (NEW.id, 10, 10, 10, 10, 10, 10)
  ON CONFLICT (user_id) DO NOTHING;

  -- 3. Insert Starter Quests
  INSERT INTO public.quests (user_id, title, description, difficulty, attribute_type, xp_reward, gold_reward, streak_bonus, completed, time_string, protocol_type, meta_badge, is_boss)
  VALUES 
  (NEW.id, 'Morning Deep Work: 90m Code Session', 'Execute focused algorithm design & full-stack matrix integration.', 'HARD', 'INTELLECT', 150, 60, 6, false, '11:30 AM', '[ BOSS GATE // INTELLECT ]', 'BOSS GATE', true),
  (NEW.id, 'Iron Temple: Heavy Squat & Pullups', 'Boost core power output and forge physical fortitude.', 'MEDIUM', 'STRENGTH', 75, 28, 3, false, NULL, '[ RITUAL // STRENGTH ]', 'Ready to Claim', false),
  (NEW.id, 'Hydration Overdrive & 5k Velocity Run', 'Log 2.5L clean hydration and complete endurance cardio trial.', 'EASY', 'STAMINA', 35, 18, 2, false, 'Daily Cycle', '[ RITUAL // STAMINA ]', 'Daily Cycle', false),
  (NEW.id, 'Citadel Sweep: Inbox Zero & Code Review', 'Clear system clutter and approve pending pull request merges.', 'TRIVIAL', 'AGILITY', 20, 12, 1, false, '3:00 PM', '[ PROTOCOL // AGILITY ]', '3:00 PM', false)
  ON CONFLICT DO NOTHING;

  -- 4. Insert Starter Habits
  INSERT INTO public.habits (user_id, title, notes, is_positive, is_negative, positive_count, negative_count, difficulty, attribute_type)
  VALUES
  (NEW.id, '25-Minute Deep Focus Sprint', 'No distractions or multitasking. Pure flow state.', true, false, 0, 0, 'MEDIUM', 'INTELLECT'),
  (NEW.id, 'Clean Hydration & Electrolytes', 'Drink 500ml water upon waking or working.', true, false, 0, 0, 'EASY', 'STAMINA'),
  (NEW.id, 'Doomscrolling / Mindless Feeds', 'Mindless scrolling drains operator focus and damages HP!', false, true, 0, 0, 'HARD', 'AGILITY'),
  (NEW.id, 'Posture Calibration & Stretch', 'Stand up, stretch shoulders, calibrate spinal alignment.', true, true, 0, 0, 'TRIVIAL', 'STRENGTH')
  ON CONFLICT DO NOTHING;

  -- 5. Insert Starter Dailies
  INSERT INTO public.dailies (user_id, title, notes, completed, streak, difficulty, attribute_type)
  VALUES
  (NEW.id, 'Daily Code Commit & Matrix Sync', 'Ship at least 1 clean pull request or feature commit.', false, 0, 'MEDIUM', 'INTELLECT'),
  (NEW.id, 'Physical Calisthenics or Cardio', 'Complete 30 minutes of physical conditioning.', false, 0, 'EASY', 'STAMINA')
  ON CONFLICT DO NOTHING;

  -- 6. Insert Starter Todos
  INSERT INTO public.todos (user_id, title, notes, completed, due_date, difficulty, attribute_type)
  VALUES
  (NEW.id, 'Deploy Life RPG Production Release', 'Verify responsive build, Supabase integration, and audio synthesis.', false, 'Today', 'HARD', 'INTELLECT'),
  (NEW.id, 'Configure Google OAuth Client Credentials', 'Add client ID and secret in Supabase dashboard for cross-device sync.', false, 'This Week', 'MEDIUM', 'AGILITY')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users if auth schema exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 10. SEED BAZAAR CATALOG
-- ----------------------------------------------------------------------------
INSERT INTO items (name, description, category, cost_gold, cost_shards, rarity, stat_bonus, icon_emoji)
VALUES 
('Quantum Katana MK-IV', 'Increases critical XP multiplier by 20% on Hard quests.', 'GEAR', 500, 15, 'LEGENDARY', '+15% CRIT XP', '⚔️'),
('Cyber-Visor HUD Skin', 'Holographic matrix interface with real-time analytics.', 'CODES', 300, 10, 'EPIC', '+5 INTELLECT', '🥽'),
('Neuro-Stim Overclock Potion', 'Instantly boosts XP gains by 2x for the next 60 minutes.', 'CONSUMABLE', 150, 5, 'RARE', '2X XP BOOST', '🧪'),
('Chrono-Knight Aegis', 'Heavy kinetic forcefield shield that prevents streak loss on missed days.', 'GEAR', 750, 25, 'LEGENDARY', 'STREAK SHIELD', '🛡️')
ON CONFLICT DO NOTHING;
