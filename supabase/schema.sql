-- ============================================================================
-- LIFE RPG: SUPABASE POSTGRESQL DATABASE SCHEMA
-- Project URL: https://axohgdwrwncznynmltta.supabase.co
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE (Hero Profile, Levels, Economy)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL DEFAULT 'Nexus Operator',
    class_title VARCHAR(100) NOT NULL DEFAULT 'CHRONO-KNIGHT',
    specialization VARCHAR(150) DEFAULT 'Cyber-Focus Kinetic Synthesis',
    level INT NOT NULL DEFAULT 14,
    hp INT NOT NULL DEFAULT 780,
    max_hp INT NOT NULL DEFAULT 800,
    xp INT NOT NULL DEFAULT 3850,
    next_level_xp INT NOT NULL DEFAULT 4000,
    total_xp INT NOT NULL DEFAULT 18450,
    gold INT NOT NULL DEFAULT 1420,
    cyber_shards INT NOT NULL DEFAULT 48,
    streak_count INT NOT NULL DEFAULT 7,
    longest_streak INT NOT NULL DEFAULT 14,
    unspent_skill_points INT NOT NULL DEFAULT 2,
    is_overclocked BOOLEAN NOT NULL DEFAULT FALSE,
    vitality_bonus NUMERIC(4, 1) DEFAULT 12.8,
    surge_bonus NUMERIC(4, 1) DEFAULT 18.0,
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
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    str INT NOT NULL DEFAULT 14,
    intellect INT NOT NULL DEFAULT 18,
    sta INT NOT NULL DEFAULT 14,
    agi INT NOT NULL DEFAULT 11,
    syn INT NOT NULL DEFAULT 16,
    void INT NOT NULL DEFAULT 12,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. QUESTS TABLE (Daily Habits, Tasks & Boss Gates)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
-- 4. ITEMS & BAZAAR CATALOG
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

-- ----------------------------------------------------------------------------
-- 5. USER INVENTORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- ----------------------------------------------------------------------------
-- 6. ENABLE ROW LEVEL SECURITY (RLS) & POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo/anon mode
CREATE POLICY "Public Read Users" ON users FOR SELECT USING (true);
CREATE POLICY "Public Insert Users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Users" ON users FOR UPDATE USING (true);

CREATE POLICY "Public Read Attributes" ON user_attributes FOR SELECT USING (true);
CREATE POLICY "Public Insert Attributes" ON user_attributes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Attributes" ON user_attributes FOR UPDATE USING (true);

CREATE POLICY "Public Read Quests" ON quests FOR SELECT USING (true);
CREATE POLICY "Public Insert Quests" ON quests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Quests" ON quests FOR UPDATE USING (true);
CREATE POLICY "Public Delete Quests" ON quests FOR DELETE USING (true);

CREATE POLICY "Public Read Items" ON items FOR SELECT USING (true);
CREATE POLICY "Public Read Inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Public Insert Inventory" ON inventory FOR INSERT WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 7. INITIAL SEED DATA
-- ----------------------------------------------------------------------------
-- Insert Default Hero if not exists
INSERT INTO users (id, username, class_title, specialization, level, hp, max_hp, xp, next_level_xp, total_xp, gold, cyber_shards, streak_count, unspent_skill_points)
VALUES ('00000000-0000-0000-0000-000000000001', 'Nexus Operator', 'CHRONO-KNIGHT', 'Cyber-Focus Kinetic Synthesis', 14, 780, 800, 3850, 4000, 18450, 1420, 48, 7, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert Hero Attributes
INSERT INTO user_attributes (user_id, str, intellect, sta, agi, syn, void)
VALUES ('00000000-0000-0000-0000-000000000001', 14, 18, 14, 11, 16, 12)
ON CONFLICT DO NOTHING;

-- Insert Starter Quests
INSERT INTO quests (user_id, title, description, difficulty, attribute_type, xp_reward, gold_reward, streak_bonus, completed, time_string, protocol_type, meta_badge, is_boss)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Morning Deep Work: 90m Code Session', 'Execute focused algorithm design & full-stack matrix integration.', 'HARD', 'INTELLECT', 150, 60, 6, false, '11:30 AM', '[ BOSS GATE // INTELLECT ]', 'BOSS GATE', true),
('00000000-0000-0000-0000-000000000001', 'Iron Temple: Heavy Squat & Pullups', 'Boost core power output and forge physical fortitude.', 'MEDIUM', 'STRENGTH', 75, 28, 3, false, NULL, '[ RITUAL // STRENGTH ]', 'Ready to Claim', false),
('00000000-0000-0000-0000-000000000001', 'Hydration Overdrive & 5k Velocity Run', 'Log 2.5L clean hydration and complete endurance cardio trial.', 'EASY', 'STAMINA', 35, 18, 2, false, 'Daily Cycle', '[ RITUAL // STAMINA ]', 'Daily Cycle', false),
('00000000-0000-0000-0000-000000000001', 'Citadel Sweep: Inbox Zero & Code Review', 'Clear system clutter and approve pending pull request merges.', 'TRIVIAL', 'AGILITY', 20, 12, 1, false, '3:00 PM', '[ RITUAL // AGILITY ]', '3:00 PM', false)
ON CONFLICT DO NOTHING;

-- Insert Bazaar Items
INSERT INTO items (name, description, category, cost_gold, cost_shards, rarity, stat_bonus, icon_emoji)
VALUES 
('Quantum Katana MK-IV', 'Increases critical XP multiplier by 20% on Hard quests.', 'GEAR', 500, 15, 'LEGENDARY', '+15% CRIT XP', '⚔️'),
('Cyber-Visor HUD Skin', 'Holographic matrix interface with real-time analytics.', 'CODES', 300, 10, 'EPIC', '+5 INTELLECT', '🥽'),
('Neuro-Stim Overclock Potion', 'Instantly boosts XP gains by 2x for the next 60 minutes.', 'CONSUMABLE', 150, 5, 'RARE', '2X XP BOOST', '🧪'),
('Chrono-Knight Aegis', 'Heavy kinetic forcefield shield that prevents streak loss on missed days.', 'GEAR', 750, 25, 'LEGENDARY', 'STREAK SHIELD', '🛡️')
ON CONFLICT DO NOTHING;
