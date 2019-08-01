create database project7;
use project7;


drop table usertbl;

create table usertbl
(
	user_id varchar(30),
    user_pw varchar(30),
    user_email varchar(50),
    serial_num bigint primary key
);


create table questiontbl
(
    que_num INT auto_increment primary key,
    que_title varchar(100),
    que_contents varchar(1000),
    que_correctAnswer INT,
    que_triedPeople INT,
    que_correctedPeople INT,
    soloORpackage INT,
    serial_num bigint,
    foreign key questiontbl(serial_num) references usertbl(serial_num)
);

create table packagetbl
(
	package_num INT auto_increment primary key,
	pack_triedpeople INT,
	serial_num bigint,
    foreign key packagetbl(serial_num) references usertbl(serial_num)
);

create table questionINpackage
(
	user_correctedPeople INT,
    que_num INT,
    package_num INT,
    foreign key questionINpackage(que_num) references questiontbl(que_num),
    foreign key packagetbl(package_num) references packagetbl(package_num)
);


drop procedure createSerialNum;

delimiter //
create procedure createUser
(
	in user_id varchar(20),
    in pw varchar(30),
    in email varchar(50)
)
begin
set @x = cast((select date_format(now(),'%y')) as char(2));

#if(if(left(@x,1),false,true)) then 
#select @x = '1';
#end if;

set @y = cast((select date_format(now(),'%m')) as char(2));
set @z = cast((select date_format(now(),'%d')) as char(2));

set @q=  concat(@x,@y,@z,user_id);

insert into usertbl values(user_id,pw,email,@q);

end //
delimiter ;

call createUser('20143674','1234','chr6502@hanmil.net');

select * from usertbl;

