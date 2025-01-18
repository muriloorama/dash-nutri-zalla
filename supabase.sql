-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA extensions;

-- Add unique constraint to whatsapp column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'unique_whatsapp'
    ) THEN
        ALTER TABLE appointments
        ADD CONSTRAINT unique_whatsapp UNIQUE (whatsapp);
    END IF;
END $$;

-- Convert boolean columns to text
ALTER TABLE appointments
  ALTER COLUMN cancelar_pedido_guia TYPE text USING 
    CASE cancelar_pedido_guia
      WHEN true THEN 'Sim'
      WHEN false THEN 'Não'
      ELSE '-'
    END,
  ALTER COLUMN aprovado TYPE text USING 
    CASE aprovado
      WHEN true THEN 'Sim'
      WHEN false THEN 'Não'
      ELSE '-'
    END;

-- Create a function to handle updates and send to webhook
CREATE OR REPLACE FUNCTION notify_appointment_update()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url text := 'https://flow.oramatech.com.br/webhook/2f549d8b-d430-43d6-870b-28bf7596de4e';
  response_status int;
  change_type text;
  change_value text;
BEGIN
  -- Reset variables
  change_type := NULL;
  change_value := NULL;

  -- Check each field for changes and send individual webhooks for each change
  IF NEW.guia IS DISTINCT FROM OLD.guia THEN
    SELECT INTO response_status
      status
    FROM
      extensions.http((
        'POST',
        webhook_url,
        ARRAY[extensions.http_header('Content-Type', 'application/json')],
        'application/json',
        jsonb_build_object(
          'tipo', 'guia',
          'value', NEW.guia,
          'appointment_id', NEW.id
        )::text
      )::extensions.http_request);
  END IF;

  IF NEW.consulta IS DISTINCT FROM OLD.consulta THEN
    SELECT INTO response_status
      status
    FROM
      extensions.http((
        'POST',
        webhook_url,
        ARRAY[extensions.http_header('Content-Type', 'application/json')],
        'application/json',
        jsonb_build_object(
          'tipo', 'consulta',
          'value', NEW.consulta,
          'appointment_id', NEW.id
        )::text
      )::extensions.http_request);
  END IF;

  IF NEW.cancelar_pedido_guia IS DISTINCT FROM OLD.cancelar_pedido_guia THEN
    SELECT INTO response_status
      status
    FROM
      extensions.http((
        'POST',
        webhook_url,
        ARRAY[extensions.http_header('Content-Type', 'application/json')],
        'application/json',
        jsonb_build_object(
          'tipo', 'cancelar_pedido_guia',
          'value', NEW.cancelar_pedido_guia,
          'appointment_id', NEW.id
        )::text
      )::extensions.http_request);
  END IF;

  IF NEW.aprovado IS DISTINCT FROM OLD.aprovado THEN
    SELECT INTO response_status
      status
    FROM
      extensions.http((
        'POST',
        webhook_url,
        ARRAY[extensions.http_header('Content-Type', 'application/json')],
        'application/json',
        jsonb_build_object(
          'tipo', 'aprovado',
          'value', NEW.aprovado,
          'appointment_id', NEW.id
        )::text
      )::extensions.http_request);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updates
DROP TRIGGER IF EXISTS on_appointment_update ON appointments;
CREATE TRIGGER on_appointment_update
  AFTER UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION notify_appointment_update();
