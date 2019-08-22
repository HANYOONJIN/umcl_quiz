create database project8;
use project8;

create table usertable
(
    user_email varchar(1000) primary key not null,
    user_pw varchar(1000) not null,
    user_name varchar(1000) not null,
    user_schoolnumber int not null
);

insert into usertable values ('chr6502@naver.com', '1234', '고지훈', 20143674);
insert into usertable values ('chr6503@naver.com', '1234', '고지순', 20143675);
insert into usertable values ('chr6504@naver.com', '1234', '고지은', 20143676);

create table questiontable
(
	que_number int auto_increment primary key,
    que_title varchar(1000) not null,
    que_contants varchar(1000) not null,
    que_triedPeople int default 0,
    que_correctedPeople int default 0,
    que_correctAnswer varchar(1000) not null,
    que_score int not null,
    que_tag varchar(1000) not null,
    que_useremail varchar(1000),
    foreign key questiontable(que_useremail) references usertable(user_email) on delete cascade on update cascade
);

insert into questiontable(que_title, que_contants, que_correctAnswer, que_score, que_tag, que_useremail)
	values ('A+B의 결과값은 무엇입니까?', 'A=3, B=7일때 A+B의 결과값은 무엇입니까?', '10', 3, 'C++', 'chr6502@naver.com');
insert into questiontable(que_title, que_contants, que_correctAnswer, que_score, que_tag, que_useremail)
	values ('A*B의 결과값은 무엇입니까?', 'A=3, B=7일때 A*B의 결과값은 무엇입니까?', '21', 3, 'C++', 'chr6502@naver.com');
insert into questiontable(que_title, que_contants, que_correctAnswer, que_score, que_tag, que_useremail)
	values ('A/B의 결과값은 무엇입니까?', 'A=6, B=3일때 A/B의 결과값은 무엇입니까?', '2', 3, 'C++', 'chr6502@naver.com');    
insert into questiontable(que_title, que_contants, que_correctAnswer, que_score, que_tag, que_useremail)
	values ('A-B의 결과값은 무엇입니까?', 'A=10, B=7일때 A-B의 결과값은 무엇입니까?', '3', 3, 'C++', 'chr6502@naver.com');


create table packagetable
(
	package_number int auto_increment primary key,
    package_title varchar(1000) not null,
    package_contants varchar(1000) not null,
    package_userid varchar(1000),
    foreign key packagetable(package_userid) references usertable(user_email) on delete cascade on update cascade
);

insert into packagetable(package_title, package_contants, package_userid) values ('1주차 미니퀴즈', '2019-08-21시행', 'chr6502@naver.com');
insert into packagetable(package_title, package_contants, package_userid) values ('2주차 미니퀴즈', '2019-08-22시행', 'chr6502@naver.com');

create table que_package
(
	package_num int,
    que_num int,
    foreign key (package_num) references packagetable(package_number) on delete cascade on update cascade,
    foreign key (que_num) references questiontable(que_number) on delete cascade on update cascade
);

insert into que_package(package_num, que_num) values (1,1);
insert into que_package(package_num, que_num) values (1,2);
insert into que_package(package_num, que_num) values (1,3);
insert into que_package(package_num, que_num) values (1,4);

create table result_package
(
	package_number int not null,
    res_quenumber int not null,
    res_queanswer varchar(1000) not null,
    res_correctuser varchar(1000),
    res_trieduser varchar(1000),
	foreign key (package_number) references packagetable(package_number) on delete cascade on update cascade,
    foreign key (res_quenumber) references questiontable(que_number) on delete cascade on update cascade,
    foreign key (res_trieduser) references usertable(user_email) on delete cascade on update cascade,
	foreign key (res_correctuser) references usertable(user_email) on delete cascade on update cascade
);

insert into result_package(package_number, res_quenumber, res_queanswer,res_correctuser,res_trieduser) values (1,1,'10','chr6502@naver.com','chr6502@naver.com');


create table result_question
(
	res_quenumber int not null,
    res_queanswer varchar(1000) not null,
    res_correctuser varchar(1000),
    res_trieduser varchar(1000),
    foreign key (res_quenumber) references questiontable(que_number) on delete cascade on update cascade,
	foreign key (res_trieduser) references usertable(user_email) on delete cascade on update cascade,
	foreign key (res_correctuser) references usertable(user_email) on delete cascade on update cascade
);

insert into result_question(res_quenumber, res_queanswer, res_correctuser, res_trieduser) values (1,'10','chr6502@naver.com','chr6502@naver.com');
insert into result_question(res_quenumber, res_queanswer, res_correctuser, res_trieduser) values (2,'21','chr6502@naver.com','chr6502@naver.com');

-- 문제집(패키지)에 올라온 최신 글 5개 출력
select * from packagetable order by package_number desc limit 5;
-- 개별 문제(퀴즈)에 올라온 최신 글 5개 출력
select * from questiontable order by que_number desc limit 5;
-- 존재하는 아이디인지 검색
select user_email from usertable where user_email = 'chr6502@naver.com';	
-- 존재한다면 해당 아이디의 비밀번호 출력
select user_email, user_pw from usertable where user_email = 'chr6502@naver.com';
-- 해당 아이디에 맞는 정보 출력
select * from usertable where user_email = 'chr6502@naver.com';
-- 수정된 정보 업데이트
update usertable set user_schoolnumber = 20171111 where user_email = 'chr6502@naver.com';
-- 문제집 테이블의 데이터를 모두 출력(서버가 터지지 않도록 개수 제한)
select * from packagetable limit 5;
-- 내가 쓴 문제집 리스트
select * from packagetable where package_userid = 'chr6502@naver.com';
-- 남이 쓴 문제집 리스트
select * from packagetable where not package_userid = 'chr6502@naver.com';
-- 해당아이디를 결과 테이블에 검색했을 때 나오는 문제집을 문제집 테이블에서 출력
select * from result_package where res_trieduser = 'chr6502@naver.com';
-- 해당아이디를 결과 테이블에 검색했을 때 나오지 않는 문제집을 문제집 테이블에서 출력
select * from result_package where not res_trieduser = 'chr6502@naver.com';
-- 문제집과 같은 내용이지만 데이터는 문제 테이블에서 출력
-- que_package를 사용해 출력