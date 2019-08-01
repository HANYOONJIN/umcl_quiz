create schema project7;
use project7;

create table usertbl(
	user_id varchar(30),
    user_pw varchar(30),
    user_email varchar(50),
    serial_num bigint primary key
);

create table questiontbl(
    que_num INT auto_increment primary key,
    que_head varchar(100),
    que_body varchar(1000),
    que_correctanswer INT,
    que_triedpeople INT,
    que_correctedpeople INT,
    package_num INT,
    serial_num bigint,
    foreign key questiontbl(serial_num) references usertbl(serial_num)
);

create table packagetbl(
    package_num INT auto_increment primary key,
	serial_num bigint,
    foreign key packagetbl(serial_num) references usertbl(serial_num)
);

create table userlogtbl(
	que_num int,
	serial_num bigint,
    foreign key (que_num) references questiontbl(que_num),
    foreign key (serial_num) references usertbl(serial_num)
);

delimiter //
create procedure createUser
(
	in user_id varchar(20),
    in pw varchar(30),
    in email varchar(50)
)
begin
set @x = cast((select date_format(now(),'%y')) as char(2));
set @y = cast((select date_format(now(),'%m')) as char(2));
set @z = cast((select date_format(now(),'%d')) as char(2));

set @q=  concat(@x,@y,@z,user_id);

insert into usertbl values(user_id,pw,email,@q);

end //
delimiter ;
