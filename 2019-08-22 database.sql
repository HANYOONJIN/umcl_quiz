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
    que_correctAnswer varchar(1000) not null,
    que_score int not null,
    que_tag varchar(1000) not null,
    que_useremail varchar(1000),
    foreign key questiontable(que_useremail) references usertable(user_email) on delete cascade on update cascade
);
alter table questiontable drop correct;

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
    package_score int not null,
    package_userid varchar(1000),
    foreign key packagetable(package_userid) references usertable(user_email) on delete cascade on update cascade
);

alter table packagetable change package_score package_score INT default 0 not null;

insert into packagetable(package_title, package_contants, package_userid) values ('1주차 미니퀴즈', '2019-08-21시행', 'chr6502@naver.com');
insert into packagetable(package_title, package_contants, package_userid) values ('2주차 미니퀴즈', '2019-08-22시행', 'chr6502@naver.com');

create table que_package
(
	package_num int,
    que_num int,
    que_score int not null,
    foreign key (package_num) references packagetable(package_number) on delete cascade on update cascade,
    foreign key (que_num) references questiontable(que_number) on delete cascade on update cascade
);
alter table que_package add que_score int not null;

insert into que_package(package_num, que_num, que_score) values (4,1,20);
insert into que_package(package_num, que_num, que_score) values (4,2,20);
insert into que_package(package_num, que_num, que_score) values (4,3,30);
insert into que_package(package_num, que_num, que_score) values (4,4,30);

create table result_question
(
	package_number int,
	res_quenumber int not null,
    res_queanswer varchar(1000) not null,
    res_correctuser bool default false,
    res_trieduser varchar(1000),
    foreign key (package_number) references que_package(package_num) on delete cascade on update cascade,
    foreign key (res_quenumber) references que_package(que_num) on delete cascade on update cascade,
	foreign key (res_trieduser) references usertable(user_email) on delete cascade on update cascade
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



























-- package 목록 출력
select * from packagetable order by package_number DESC limit 5;
-- package 생성
insert into packagetable(package_title, package_contants, package_userid) values ('3주차 미니퀴즈', '2019-08-26', 'chr6502@naver.com');
insert into packagetable(package_title, package_contants, package_userid) values ('4주차 미니퀴즈', '2019-08-26', 'chr6502@naver.com');
-- package 삭제
delete from packagetable where package_number = 1;
set @number = 0;
UPDATE packagetable SET package_number = @number := @number+1;
-- package 복사
INSERT  INTO  packagetable(package_title, package_contants, package_userid)  select package_title, package_contants, package_userid from packagetable where package_number = 1;
set @number = 0;
UPDATE packagetable SET package_number = @number := @number+1;
-- package 클릭
select * from packagetable where package_number = 1;
-- question목록
select * from questiontable order by que_number DESC limit 5;
-- question생성
insert into questiontable(que_title, que_contants, que_correctAnswer, que_score, que_tag, que_useremail) values ('A+B의 값은?', 'A=7, B=10일때 결과는 무엇입니까?', '17', 20, 'C++', 'chr6502@naver.com');
-- question삭제
delete from questiontable where que_number = 1;
set @number = 0;
UPDATE questiontable SET que_number = @number := @number+1;
-- question수정
update questiontable set que_title = 'B+A의 결과는 무엇입니까?', que_score = 10, que_tag = 'JavaScript' where que_number = 1; 
-- question클릭
select * from questiontable order by que_number DESC limit 5;
-- que_package에 문제 삽입
insert into que_package values (1,1),(1,2),(1,3),(1,4);
insert into que_package values (2,1),(2,2),(2,3),(2,4);
-- que_package에 문제 삭제
delete from que_package where package_num = 2 && que_num = 2;
-- que_package 클릭
select package_num, que_num, questiontable.que_title, questiontable.que_contants, que_package.que_score, questiontable.que_tag from que_package inner join questiontable on que_package.que_num = questiontable.que_number where package_num = 4 order by que_num;
-- 정답 제출 삽입
insert into result_question(package_number, res_quenumber, res_queanswer, res_correctuser, res_trieduser) values (4, 3, '17', false, 'chr6502@naver.com'); 
set @x = (select result_question.res_queanswer from result_question where res_quenumber = 4); 
set @y = (select questiontable.que_correctAnswer from questiontable where que_number = 4);
update result_question set res_correctuser = if(@x = @y, true, false) where res_quenumber = 4;

select questiontable.que_correctAnswer, res_queanswer from result_question inner join questiontable on questiontable.que_number = result_question.res_quenumber where res_quenumber = 4;

update packagetable set package_score = (select sum(que_package.que_score) from que_package inner join result_question on que_package.package_num = result_question.package_number && que_package.que_num = result_question.res_quenumber where package_number = 4) where package_number = 4;

select sum(que_package.que_score) from que_package inner join result_question on que_package.package_num = result_question.package_number && que_package.que_num = result_question.res_quenumber where package_number = 4;