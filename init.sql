-- Initial SQL schema to bootstrap the DB container
CREATE TABLE fine_rules (
    id SERIAL PRIMARY KEY,
    version INTEGER NOT NULL,
    effective_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_to TIMESTAMP WITH TIME ZONE,
    base_amounts JSONB NOT NULL, 
    time_multipliers JSONB NOT NULL,
    repeat_multipliers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE violations (
    id SERIAL PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL,
    violation_type VARCHAR(50) NOT NULL,
    location TEXT NOT NULL,
    violation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    photo_url TEXT,
    rule_version_id INTEGER NOT NULL REFERENCES fine_rules(id),
    calculated_fine NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    violation_id INTEGER NOT NULL REFERENCES violations(id),
    amount NUMERIC(12, 2) NOT NULL,
    payment_scenario VARCHAR(20) NOT NULL,
    transaction_id VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
