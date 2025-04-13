
-- Create user_api_keys table to store API keys for different providers
CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider_id TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, provider_id)
);

-- Create agent_conversations table to store conversations with agents
CREATE TABLE IF NOT EXISTS agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  thinking TEXT,
  agent_name TEXT
);

-- Create database functions for analytics
CREATE OR REPLACE FUNCTION get_agent_usage(from_date DATE, to_date DATE)
RETURNS TABLE(agent_name TEXT, usage_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT ac.agent_name, COUNT(*) as usage_count
  FROM agent_conversations ac
  WHERE ac.timestamp::DATE BETWEEN from_date AND to_date
  GROUP BY ac.agent_name
  ORDER BY usage_count DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_daily_active_users(from_date DATE, to_date DATE)
RETURNS TABLE(time TEXT, active_users BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(day, 'YYYY-MM-DD') as time,
    COUNT(DISTINCT user_id) as active_users
  FROM (
    SELECT 
      generate_series(from_date, to_date, '1 day'::interval)::date as day,
      ac.id as user_id
    FROM agent_conversations ac
    WHERE ac.timestamp::DATE BETWEEN from_date AND to_date
  ) AS daily_users
  GROUP BY day
  ORDER BY day;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_daily_conversations(from_date DATE, to_date DATE)
RETURNS TABLE(time TEXT, conversations BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(day, 'YYYY-MM-DD') as time,
    COUNT(ac.id) as conversations
  FROM (
    SELECT generate_series(from_date, to_date, '1 day'::interval)::date as day
  ) as days
  LEFT JOIN agent_conversations ac ON ac.timestamp::DATE = day
  GROUP BY day
  ORDER BY day;
END;
$$ LANGUAGE plpgsql;
