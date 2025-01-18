-- First, temporarily disable the constraint
ALTER TABLE appointments 
ALTER COLUMN data_agendamento DROP NOT NULL;

-- If there are any existing rows with NULL values that need to be updated
UPDATE appointments 
SET data_agendamento = NULL 
WHERE data_agendamento IS NULL;
