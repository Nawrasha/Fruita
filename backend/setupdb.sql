/*
this script to set up dab with table 

==============================================================
BE WARE
==============================================================
this script will wipe out all the data in your db run it when you are not risking valued data

*/
create database if not exists fruita;
use fruita ;
drop table if exists user;
create table user (
id int auto_increment primary key,
nom_complet varchar(255),
email varchar(255),
password varchar(255),
role enum('admin', 'user')
);
drop table if exists products;
create table products (
id int auto_increment primary key,
nom_produit varchar(255),
prix float,
description text,
categorie varchar(255),
image varchar(255)
);

ALTER TABLE user 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


describe user ;
describe products;
