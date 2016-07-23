SET sql_mode='PIPES_AS_CONCAT';

drop trigger if exists name_lower_trigger;

--drop trigger if exists keywords;

DELIMITER $$
create trigger name_lower_trigger
before insert on Product
for each row
begin
 SET New.name_lower = lower(New.name);
end$$
DELIMITER ;

/*DELIMITER $$
create trigger keywords
before insert on Product_Ingredient
for each row
begin
    update Product set keywords=keywords||' '||New.ingredient_name;
end $$
DELIMITER ;*/

DELIMITER $$
create trigger rating_trigger
after insert on Review
for each row
begin
 declare v_avg integer;
 select ROUND(AVG(grade),2) into v_avg from Review where barcode=New.barcode;    
 update Product set rating=v_avg where barcode=New.barcode;
end$$
DELIMITER ;