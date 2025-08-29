-- Add trial fields to profiles table if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS has_used_trial BOOLEAN DEFAULT FALSE;

-- Add subscription columns if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';

-- Update existing users to have used their trial (so they don't get a new one)
UPDATE profiles 
SET has_used_trial = TRUE 
WHERE created_at < NOW() AND has_used_trial IS NULL;

-- Create function to automatically start trial for new users
CREATE OR REPLACE FUNCTION start_trial_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Only start trial if user hasn't used one before
    IF NEW.has_used_trial IS NULL OR NEW.has_used_trial = FALSE THEN
        NEW.trial_started_at = NOW();
        NEW.trial_ends_at = NOW() + INTERVAL '7 days';
        NEW.has_used_trial = TRUE;
        NEW.subscription_status = 'trial';
        NEW.subscription_plan = 'pro';
    ELSE
        -- Set defaults for users who have already used trial
        NEW.subscription_status = COALESCE(NEW.subscription_status, 'free');
        NEW.subscription_plan = COALESCE(NEW.subscription_plan, 'free');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_start_trial_for_new_user ON profiles;

-- Create trigger to auto-start trial for new users
CREATE TRIGGER trigger_start_trial_for_new_user
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION start_trial_for_new_user();

-- Create function to check and update expired trials
CREATE OR REPLACE FUNCTION update_expired_trials()
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET subscription_status = 'expired',
        subscription_plan = 'free'
    WHERE subscription_status = 'trial' 
    AND trial_ends_at < NOW();
END;
$$ LANGUAGE plpgsql;