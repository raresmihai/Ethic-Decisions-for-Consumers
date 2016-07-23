SET FOREIGN_KEY_CHECKS = 0;

drop table if exists User_Preferences;

drop table if exists Product_Ingredient;

drop table if exists Review;

drop table if exists User_Campaign;

drop table if exists Product;

drop table if exists Campaign;

drop table if exists User;

SET FOREIGN_KEY_CHECKS = 1;

create table User
(email_address varchar(40),
first_Name varchar(40) not null,
last_Name varchar(40) not null,
password varchar(40) not null,
reputation integer not null default 0,
PRIMARY KEY (email_address),
CHECK (LENGTH(TRIM(TRANSLATE(first_Name, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ' '))) < 0),
CHECK (LENGTH(TRIM(TRANSLATE(last_Name, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ' '))) < 0),
CHECK (LENGTH(TRIM(TRANSLATE(password, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', ' '))) < 0));

create table Product
(barcode varchar(20),
name varchar(200) not null,
name_lower varchar(200) not null,
price varchar(20),
rating integer default 0 not null check(rating<=5),
image varchar(90),
category_name varchar(100) not null,
primary key (barcode),
CHECK (LENGTH(TRIM(TRANSLATE(barcode, '0123456789', ' '))) < 0));

create table Campaign
(campaign_id integer auto_increment,
campaign_name varchar(50) not null,
description varchar(1000) not null,
campaign_photo varchar(500) not null,
administrator varchar(40),
barcode varchar(20),
creation_date date not null,
primary key (campaign_id),
foreign key (barcode) references Product(Barcode) on delete cascade,
foreign key (administrator) references User(email_address) on delete cascade);

create table User_Campaign
(campaign_id integer,
email_address varchar(40),
foreign key (campaign_id) references Campaign(campaign_id) on delete cascade,
foreign key (email_address) references User(email_address) on delete cascade,
primary key (campaign_id,email_address));

create table Product_Ingredient
(barcode varchar(20),
ingredient_name varchar(200),
foreign key (barcode) references Product(barcode) on delete cascade,
primary key (barcode,ingredient_name));

create table Review
(email_address varchar(40),
barcode varchar(20),
title varchar(100),
grade integer not null check(grade>=1 and grade<=5),
content varchar(3000),
post_date datetime not null,
foreign key (email_address) references User(email_address) on delete cascade,
foreign key (barcode) references Product(barcode) on delete cascade,
primary key (email_address,barcode));

create table User_Preferences
(email_address varchar(40),
ingredient_name varchar(200),
preference varchar(30) not null,
reason varchar(200),
primary key(email_address, ingredient_name),
foreign key(email_address) references User(email_address) on delete cascade,
foreign key(ingredient_name) references Product_Ingredient(ingredient_name) on delete cascade);

create table Specification
(specification_id varchar(10),
spectype varchar(100) not null,
subspectype varchar(100) not null,
specval varchar(30) not null,
primary key (specification_id));

CREATE TABLE ACTIONS(
    -> email_address VARCHAR(40),                       
    -> first_Name VARCHAR(40),
    -> last_Name VARCHAR(40),
    -> action VARCHAR(200),
    -> action_code VARCHAR(20),    -> 
    -> link_name VARCHAR(100),
    -> link_id VARCHAR(20),
    -> action_time DATETIME
    -> );