SET sql_mode='PIPES_AS_CONCAT';

DELIMITER $$
create trigger keywords
before insert on Product
for each row
begin
 SET New.keywords = New.barcode||' '||New.name;
end$$
DELIMITER ;