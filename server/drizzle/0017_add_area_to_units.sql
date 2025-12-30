-- Add area column to units table for square meter information
ALTER TABLE units 
ADD COLUMN area DECIMAL(8, 2);

-- Add comment to explain the column
COMMENT ON COLUMN units.area IS 'Daire metrekare bilgisi (m²). NULL olabilir (eski kayıtlar için). İleride metrekareye göre dağıtım yapılırken kullanılacak.';

