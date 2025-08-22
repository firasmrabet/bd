-- Migration script for admin system tables
-- Run these commands in your Supabase SQL editor

-- Create custom_categories table
CREATE TABLE IF NOT EXISTS custom_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    characteristics JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create custom_products table
CREATE TABLE IF NOT EXISTS custom_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    image TEXT,
    category_id UUID REFERENCES custom_categories(id) ON DELETE CASCADE,
    characteristics JSONB DEFAULT '{}'::jsonb,
    variations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_products_category_id ON custom_products(category_id);
CREATE INDEX IF NOT EXISTS idx_custom_products_created_at ON custom_products(created_at);
CREATE INDEX IF NOT EXISTS idx_custom_categories_created_at ON custom_categories(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_products ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
-- Note: You'll need to adjust these policies based on your authentication setup

-- Policy for custom_categories - only allow admin access
CREATE POLICY "Admin can manage categories" ON custom_categories
    FOR ALL USING (
    (auth.jwt() ->> 'email' = 'firassmrabett111@gmail.com' OR auth.jwt() ->> 'email' = 'marwenyoussef2017@gmail.com')
    );

-- Policy for custom_products - only allow admin access
CREATE POLICY "Admin can manage products" ON custom_products
    FOR ALL USING (
    (auth.jwt() ->> 'email' = 'firassmrabett111@gmail.com' OR auth.jwt() ->> 'email' = 'marenyoussef2017@gmail.com')
    );

-- Allow public read access to categories and products for the website
CREATE POLICY "Public can read categories" ON custom_categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read products" ON custom_products
    FOR SELECT USING (true);

-- Create functions for table creation (for use in the app)
CREATE OR REPLACE FUNCTION create_custom_categories_table()
RETURNS void AS $$
BEGIN
    -- This function is just a placeholder since tables are created above
    -- It's used by the app to check if tables exist
    PERFORM 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_custom_products_table()
RETURNS void AS $$
BEGIN
    -- This function is just a placeholder since tables are created above
    -- It's used by the app to check if tables exist
    PERFORM 1
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updated_at updates
CREATE TRIGGER update_custom_categories_updated_at
    BEFORE UPDATE ON custom_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_products_updated_at
    BEFORE UPDATE ON custom_products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- Create carts table to persist per-user shopping carts
CREATE TABLE IF NOT EXISTS carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- user_id stored as UUID to match auth.users(id)
    user_id UUID NOT NULL UNIQUE,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotes table to persist user's quote history
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    quotes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);

-- Enable Row Level Security for carts and quotes
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policies: allow authenticated users to manage only their own cart/quotes
CREATE POLICY "Users can manage own cart" ON carts
    FOR ALL
    USING (auth.uid()::uuid = user_id)
    WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can manage own quotes" ON quotes
    FOR ALL
    USING (auth.uid()::uuid = user_id)
    WITH CHECK (auth.uid()::uuid = user_id);

-- Triggers to keep updated_at current
CREATE TRIGGER update_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
