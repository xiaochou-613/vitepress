# 一、初识

启动服务：

- ​		命令行启动：net start mssqlserver

- ​		SQL SERVER配置管理器

- ​		windows服务


连接数据库：

- ​		windows身份验证： 方便不需要密码

- ​		SQL SERVER身份验证 ： 不在此电脑上也可以访问，通过账号密码


基本操作： 

- ​		建库

- ​		建标

- ​		数据维护


数据库的迁移：

- ​		数据库的分离、附加

- ​		数据库备份还原（`分离后电脑上还有数据库的文件，删除了连同分离的一起删了`）

- ​		数据库脚本的保存

# 二、创建数据库

```sql
-- 判断是否存在，存在就删除
if exists(select * from sys.databases where name = 'DBTEST')
 drop database DBTEST

-- 创建数据库
create database DBTEST
on -- 数据文件
(
	name = 'DBTEST',
	filename = 'D:\DATA\DBTEST.mdf', -- 物理路径和名称
	size = 5MB, -- 文件的初始大小
	filegrowth = 2MB -- 文件的增长方式（超过5m后自动增长），可以写大小，或者百分比
)
log on -- 地址文件
(
	name = 'DBTEST_log',
	filename = 'D:\DATA\DBTEST_log.ldf', -- 加上log，文件格式为ldf
	size = 5MB, 
	filegrowth = 2MB 
)


-- 简单创建数据库  会设置默认值
create database DBTEST2
```

# 三、创建表

```sql
-- 进入DBTEXT数据库  默认是在msater里面
use DBTEST
-- 判断是是否存在Department表
if exists(select * from sys.objects where name = 'Department'and type = 'U') -- U表示是用户编写
  drop table Department -- 删表操作 危险

-- 建表
create table Department
(
	-- 部门编号，primary key 主键  identity（1,1）自动增长，初识1，增长步长1
	DepartmentId int primary key identity(1,1),

	-- 部门名称
	DepartmentName nvarchar(20) not null,

	-- 部分描述 不知道多长，但是可能很长用text
	DepartmentRemark text

)
```

char的知识点

|             |      |                                                 |                                                              |
| ----------- | ---- | ----------------------------------------------- | ------------------------------------------------------------ |
| char(n)     | 定长 | 索引效率高 程序里面使用trim去除多余的空白       | *n* 必须是一个介于 1 和 8,000 之间的数值,存储大小为 *n* 个字节 |
| varchar(n)  | 变长 | 时间效率没char高 空间分配灵活                   | *n* 必须是一个介于 1 和 8,000 之间的数值。存储大小为输入数据的字节的实际长度，而不是 *n* 个字节 |
| text(n)     | 变长 | 非Unicode数据                                   |                                                              |
| nchar(n)    | 定长 | 处理unicode数据类型(所有的字符使用两个字节表示) | *n* 的值必须介于 1 与 4,000 之间。存储大小为 *n* 字节的两倍  |
| nvarchar(n) | 变长 | 处理unicode数据类型(所有的字符使用两个字节表示) | *n* 的值必须介于 1 与 4,000 之间。字节的存储大小是所输入字符个数的两倍。所输入的数据字符长度可以为零 |
| ntext(n)    | 变长 | 处理unicode数据类型(所有的字符使用两个字节表示) |                                                              |



# 四、创建部门-职位-员工表

```sql
-- 建表 部门
create table Department
(
	-- 部门编号，primary key主键  identity（1,1）自动增长，初识1，增长步长1
	DepartmentId int primary key identity(1,1),

	-- 部门名称
	DepartmentName nvarchar(20) not null,

	-- 部分描述 不知道多长，但是可能很长用text
	DepartmentRemark text
)

-- 建表 职位
create table [Rank] -- rank 是关键词，用的话加上 [ ]
(
	-- 职位编号
	RankId int primary key identity(1,1),

	-- 职位名称
	RankName nvarchar(20) not null,

	-- 职位描述 
	RankRemark text
)

create table Employee
(
	EmpId int primary key identity(1000,1),  -- 员工的编号  主键

	-- 部门 (引用外键）参考Department的DepartmentId 不能没有
	DepartmentId int references Department(DepartmentId) not null,
	-- 职位 （同上）
	RankId int references [Rank](RankId) not null,


	EmpName nvarchar(10) not null, --姓名

	-- 性别 默认男 ，并且只能输入男或者女 （约束）
	EmpSex nvarchar(1) check(EmpSex='男' or EmpSex = '女') default('男'),

	-- date 时间最近 datetime 上下兼容，有些版本没有date smalldatetime小，查找方便
	EmpBirth smalldatetime not null,

	-- 工资 浮点数有float和decimal或者money  保证精度我们选择decimal 12位数，2位小数
	EmpSalary decimal(12,2) check(EmpSalary>=1000 or EmpSalary <=1000000),

	-- 电话，并且不能相同，唯一的
	EmpPhone varchar(11) unique not null,

	EmpAddress varchar(300), -- 地址

	-- 添加时间 默认当前时间 getdate获得当前时间
	EmpAddTime smalldatetime default(getdate())
)
```

**无法删除对象 'Department'，因为该对象正由一个 FOREIGN KEY 约束引用。**

# 五、修改表结构

不是重点，清楚有这些操作就好

```sql
--添加列  邮箱
alter table Employee add EmpMail varchar(100)

--删除列 邮箱
--alter table Employee drop column EmpMail

--修改列 邮箱的长度
alter table Employee alter column EmpMail varchar(200)
```

删除、添加约束

```sql
--删除月薪约束
alter table Employee drop constraint CK__Employee__EmpSal__440B1D61

--添加月薪约束
alter table Employee add constraint CK__Employee__EmpSal1
check(EmpSalary>=1000 and EmpSalary<=1000000)
```

各种约束的添加

```sql
--添加约束（主键）
alter table 表名 add constraint 约束名 primary key(列名)
--添加约束（唯一）
alter table 表名 add constraint 约束名 unique(列名)
--添加约束（默认值）
alter table 表名 add constraint 约束名 default 默认值 for 列名
--添加约束（外键）
alter table 表名 add constraint 约束名 foreign key(列名)
references 关联表明(列名(一般是主键))
```

# 六、插入数据

向部门插入数据

```sql
insert into Department(DepartmentName,DepartmentRemark)
values('市场部','....')
insert into Department(DepartmentName,DepartmentRemark)
values('软件部','....')
insert into Department(DepartmentName,DepartmentRemark)
values('设计部','....')

-- 简写（不推荐，如果表的结构发生变化，这样会发生错误）
insert into Department values('硬件部','....')

-- 一次性插入多行数据
insert into Department(DepartmentName,DepartmentRemark)
select '产品部','....' union
select '销售部','....' union
select '小卖部','....' 
```

IDENTITY_INSERT 设置为 OFF 时，不能为表 'Rank' 中的标识列插入显式值。

就是id不用输入，会自己增长，除非作为外键，作为外键会参考，不能超过了

```sql
-- 插入职位
insert into [Rank](RankName,RankRemark)
values('高级工程师','...')

-- 插入
insert into Employee(DepartmentId,RankId,EmpName,EmpSex,EmpBirth,EmpSalary,EmpPhone,EmpAddress,EmpAddTime)
values(7,1,'江开','男','2002-06-13',10000,'13232323233','中国',getdate())
```

设置员工表的时候要考虑约束，比如DepartmentId不能写没有的，性别不能写别的

# 七、修改数据

```sql
-- 修改
-- update 表名 set 字段1 = 值，字段2 = 值 where 条件

-- 每人工资加1000
update Employee set EmpSalary = EmpSalary + 1000 

-- 给所有女生工资扣9000
update Employee set EmpSalary = EmpSalary - 9000 
where EmpSex = '女'

-- 给软件部（编号1）的员工 工资低于5000的变成5000
update Employee set EmpSalary = 5000
where DepartmentId = 1 and EmpSalary < 5000

-- 给江开工资翻10倍，并且将手机号改为88888888888
update Employee set EmpSalary = EmpSalary *10, EmpPhone = 88888888888
where EmpName = '江开'

```

```sql
-- 删除
drop table Employee -- 删除表对象
truncate table Employee -- 删除数据（清空）
delete from Employee -- 删除所有数据

-- 区别
-- truncate 清空所有数据 不能有条件，delete可以条件删除 where
-- 假设表中有编号1,2,3,4,5
-- truncate删除后再添加仍然是1,2,3,4,5
-- delete删除数据后，此表再无1,2,3,4,5，而是从6开始
```

# 八、查询

```sql
-- 查询所有行列
select * from Employee
-- 查询指定列
select EmpName,EmpSalary from Employee
-- 查询指定列 显示中文
select EmpName 姓名,EmpSalary 工资 from Employee
-- 查询指定列 不需要重复的
select distinct(EmpAddress) from Employee
-- 查询加工资钱和加工资后对比
select EmpName 姓名,EmpSalary 加薪前,EmpSalary*1.2 加薪后 from Employee
```

## 条件查询 - 1

```sql
-- 查询工资大于1000的女性
select * from Employee where EmpSalary>=1000 and EmpSex = '女'

-- 查询月薪2000到20000之间的员工
select * from Employee where EmpSalary>=1000 and EmpSalary<=20000
select * from Employee where EmpSalary between 1000 and 20000

-- 查询出生地址在中国或者美国的员工
select * from Employee where EmpAddress = '中国' or EmpAddress = '美国' 
select * from Employee where EmpAddress in('中国','美国' )

-- 排序
-- 查询所有员工信息，根据工资排降序
select * from Employee order by EmpSalary desc -- asc:升序（默认） desc:降序

-- 根据名字长度排序 （降序）
select * from Employee order by len(EmpName) desc

-- 查询工资最高的5个人
select top 5* from Employee order by EmpSalary desc

-- 查询工资最高的前10%
select top 10 percent * from Employee order by EmpSalary desc

-- 空值查询 null
update Employee set EmpAddress = null where EmpName='江王'
select * from Employee where EmpAddress is null
select * from Employee where EmpAddress is not null
```

## 条件查询 - 2

```sql
-- 查询20-30岁之间工资在2000到5000千
select * from Employee where
(year(getdate()) - year(EmpBirth) between 20 and 30)
and
(EmpSalary between 2000 and 5000)

-- 查询星座是双子座的员工（5.22-6.22）、
select * from Employee where
(month(EmpBirth) = 5 and day(EmpBirth) >= 21)
or
(month(EmpBirth) = 6 and day(EmpBirth) <= 22)

-- 查询工资比江开底的
select * from Employee where EmpSalary <
(select EmpSalary from Employee where EmpName = '江开')

-- 查询生肖
-- 鼠、牛、 虎、 兔、龙、  蛇、 马、 羊、猴、鸡  狗、 猪
-- 4   5   6   7   8    9   10  11  0  1   2   3
select *,
case year(EmpBirth)%12
   when 4  then '鼠'
   when 5  then '牛'
   when 6  then '虎'
   when 7  then '兔'
   when 8  then '龙'
   when 9  then '蛇'
   when 10 then '马'
   when 11 then '羊'
   when 0  then '猴'
   when 1  then '鸡'
   when 2  then '狗'
   when 3  then '猪'
   end 生肖
from Employee
```

## 模糊查找 - like

```
% ：代表匹配0个字符，1个字符或多个字符
_ ：代表匹配有且只有一个字符
[] ：代表匹配范围内
[^] ： 代表匹配不在范围内
```

```sql
-- 查询姓江的员工
select *from Employee where EmpName like '江%'

-- 查询名字中有王的
select *from Employee where EmpName like '%王%' -- 只要名字里有一个王就行

-- 查询姓江的员工，名字是两个字的
select *from Employee where EmpName like '江_'
select *from Employee where SUBSTRING(EmpName,1,1) = '江' and
len(EmpName) = 2
-- SUBSTRING(EmpName,1,1)是找名字里面，从第一个字符开始的一个字符

-- 查询手机号为132开头的员工
select *from Employee where EmpPhone like '132%'

-- 查询手机号为132开头，第四位是2，或3，最后是3的
select *from Employee where EmpPhone like '132[2,3]%3'

-- 查询手机号为132开头，第四位是2-5之间，最后一位不是4-9
select *from Employee where EmpPhone like '132[2-5]%[^4-9]'
```

## 聚合查询

```sql
select * from Employee

-- 查询员工总人数
select count(*) from Employee

-- 求最高工资
select max(Empsalary) from Employee
-- 求最小工资
select min(Empsalary) from Employee
-- 求所有员工的工资综合
select sum(Empsalary) from Employee
--求所有员工的平均工资
select round(avg(Empsalary),2) from Employee -- 保留两位小数，但还是有0


-- 查询工资高于平均工资的员工
select * from Employee where  EmpSalary >
(select round(avg(Empsalary),2) from Employee) 

-- 查询月薪在5000以上男性的最大年龄和平均年龄
select max(EmpSalary) 最高工资,round(avg(EmpSalary),2) 平均工资 from Employee where
EmpSalary>=5000 and EmpSex = '男'

-- 查询数量，年龄最大值，年龄最小值，年龄总和,在一行显示
select 
count(*) 数量, 
max(year(getdate()) - year(EmpBirth)) 年龄最大值,
min(year(getdate()) - year(EmpBirth)) 年龄最小值,
sum(year(getdate()) - year(EmpBirth)) 年龄总和
from Employee

-- datedif第一个参数是返回的类型，比如year或者month，第二个参数为生日，第三个为当前时间，计算两个时间的差值
select '内容'标题,  
count(*) 数量, 
max(DATEDIFF(year,EmpBirth,getdate())) 年龄最大值,
min(DATEDIFF(year,EmpBirth,getdate()))年龄最小值,
sum(DATEDIFF(year,EmpBirth,getdate())) 年龄总和
from Employee
```

## 分组查询

```sql
-- 根据员工所在地区统计人数，最高工资，最低工资，平均工资
select EmpAddress 地区,
count(*) 人数,max(EmpSalary) 最高工资,min(EmpSalary) 最低工资,avg(EmpSalary) 平均工资
from Employee
group by EmpAddress

-- 根据员工所在地区统计人数，最高工资，最低工资，平均工资
-- 2002-6-13之前的人不参与计算
select EmpAddress 地区,
count(*) 人数,max(EmpSalary) 最高工资,min(EmpSalary) 最低工资,avg(EmpSalary) 平均工资
from Employee
where EmpBirth<'2002-6-13'   -- where要加在分组之前
group by EmpAddress

-- 根据员工所在地区统计人数，最高工资，最低工资，平均工资
-- 2002-6-13之前的人不参与计算
-- 并筛选出人数至少有3个的记录
select EmpAddress 地区,
count(*) 人数,max(EmpSalary) 最高工资,min(EmpSalary) 最低工资,avg(EmpSalary) 平均工资
from Employee
where EmpBirth<'2002-6-13' -- and count(*)>3 聚合不应出现在 where子句中
group by EmpAddress
having count(*)>3 -- 聚合函数的条件 放在having里面
```

## 多表查询 - 1

```sql
-- 笛卡尔积
-- Department * Employee 没什么意义
select * from Department,Employee

-- 简单的多表查询
-- 查询员工信息，显示部门名称
select * from Employee,Department
where Employee.DepartmentId = Department.DepartmentId

-- 查询员工信息，显示职级名称
select * from Employee,[Rank]
where Employee.RankId = [Rank].RankId

-- 查询员工信息，显示部门和职级名称
select * from Employee,[Rank],Department
where Employee.DepartmentId = Department.DepartmentId
and Employee.RankId = [Rank].RankId


-- 内连接查询
-- 查询员工信息，显示部门名称
select * from Employee inner join Department
on Employee.DepartmentId = Department.DepartmentId

-- 查询员工信息，显示职级名称
select * from Employee inner join [Rank]
on Employee.RankId = [Rank].RankId

-- 查询员工信息，显示部门和职级名称
select * from Employee
inner join Department 
on Employee.DepartmentId = Department.DepartmentId
inner join [Rank] 
on Employee.RankId = [Rank].RankId

-- 简单多表查询和内联查询有一个共同特点：不符合主外建关系的数据不会显示
-- 简单多表查询和内联查询有一个共同特点：不符合主外建关系的数据不会显示


-- 外联（左外连，右外连，全连）
-- 左外连：以左表为主表作为数据显示，主外键关系找不到的数据用null取代
-- 查询员工信息，显示部门名称
select * from Employee left join Department
on Employee.DepartmentId = Department.DepartmentId

-- 查询员工信息，显示职级名称
select * from Employee left join [Rank]
on Employee.RankId = [Rank].RankId

-- 查询员工信息，显示部门和职级名称
select * from Employee
left join Department 
on Employee.DepartmentId = Department.DepartmentId
left join [Rank] 
on Employee.RankId = [Rank].RankId

-- 右外连
-- A left join B  == B right join A

-- 全外连
-- 两张表无论数据是否符合主外键关系，全部显示
select * from Employee full join Department
on Employee.DepartmentId = Department.DepartmentId
```

## 多表查询 - 2

```sql
-- 查询中国地区所有员工，显示部门名称
select EmpId 员工编号,DepartmentName 部门,EmpName 员工姓名,EmpSex 性别,
EmpSalary 员工工资,EmpAddress 员工地址 from Employee
left join Department 
on Department.DepartmentId = Employee.DepartmentId
where EmpAddress='中国'

-- 查询中国地区所有员工，显示部门名称、职级名称
select EmpId 员工编号,DepartmentName 部门名称,RankName 职级名称,
EmpName 员工姓名,EmpSex 性别,EmpSalary 员工工资,EmpAddress 员工地址 from Employee
left join Department 
on Department.DepartmentId = Employee.DepartmentId
left join [Rank] on [Rank].RankId = Employee.RankId
where EmpAddress='中国'

-- 根据部门分组统计员工人数，平均工资
select DepartmentName,count(*),avg(EmpSalary) from Employee
left join Department on Department.DepartmentId = Employee.DepartmentId
group by Department.DepartmentId,DepartmentName

-- 根据部门分组统计员工人数，平均工资
-- 平均工资低于3000的不参与统计，并且根据平均工资降序
select DepartmentName,count(*),avg(EmpSalary) from Employee
left join Department on Department.DepartmentId = Employee.DepartmentId
group by Department.DepartmentId,DepartmentName
having avg(EmpSalary) >3000
order by avg(EmpSalary) desc

-- 根据部门分组,然后根据职级分组 统计员工人数，平均工资
select DepartmentName,RankName,count(*),avg(EmpSalary) from Employee
left join Department on Department.DepartmentId = Employee.DepartmentId
left join [Rank] on [Rank].RankId = Employee.RankId
group by Department.DepartmentId,DepartmentName,[Rank].RankId,RankName
```

## 自连接

自己连接自己

![image-20231022112523616](C:\Users\江开\Documents\Typora文档\vue的学习\SQL Server.assets\image-20231022112523616.png)

![image-20231022112527041](C:\Users\江开\Documents\Typora文档\vue的学习\SQL Server.assets\image-20231022112527041.png)

![image-20231022112606731](C:\Users\江开\Documents\Typora文档\vue的学习\SQL Server.assets\image-20231022112606731.png)

# 九、数据库设计

## 第一范式

要求数据的原子性，不可拆分

```
联系方法写成 text  放 QQ：763362409，手机号：18040503044
这样不行，可拆分

分别将QQ和phone单独分列（把字段分开）
```

## 第二范式

要求数据 保证实体的唯一性，姓名依赖学号，课程依赖课程编号不符合第二范式

![image-20231023105540855](C:\Users\江开\Documents\Typora文档\vue的学习\SQL Server.assets\image-20231023105540855.png)

拆分成学生表和课程表，并无关联，再用考试表连接起来

## 第三范式

要求字段不能由其他字段派生而来，要求字段没有冗余，即不存在传递依赖

分表操作。

## 表关系

- 一对一
- 一对多
- 多对多：最好再多加一个表进行关联

# 十、模拟银行

```sql
use Bank

create table AccountInfo 
(
	AccountId int primary key identity(1,1), -- 账户编号
	AccountCode varchar(20) not null, -- 身份证
	AccountPhone varchar(20) not null, -- 电话
	RealName varchar(20) not null,    -- 真实姓名
	OpenTime smalldatetime not null   -- 开户时间
)

create table BankCard
(
	CardNo varchar(30) primary key , -- 银行卡号
	AccountId int not null,			 -- 账户编号（外键）
	CardPwd varchar(30) not null,	 -- 密码
	CardMoney money not null,		 -- 余额
	CardState int not null,		   	 -- 状态：1正常，2挂失，3冻结，4注销
	CardTime smalldatetime default(getdate()) --开卡时间
)

create table CardExchange
(
	ExchangeId int primary key identity(1,1), -- 交易编号
	CardNo varchar(30) not null,			-- 银行卡号（外键）
	MoneyInBank money not null,				-- 存钱金额
	MoneyOutBank money not null,			-- 取钱金额
	ExchangeTime smalldatetime not null		-- 交易时间
)

create table CardTransfer
(
	TransferId int primary key identity(1,1),--转账编号
	CardNoOut varchar(30) not null,			-- 转出银行卡
	CardNoIn varchar(30) not null,			-- 转入银行卡
	TransferMoney money not null,			-- 交易金额
	TransferTime smalldatetime not null		-- 交易时间
)

create table CardStateChange
(
	StateId int primary key identity(1,1),
	CardNo varchar(30) not null,
	OldState int not null,
	NewState int not null,
	StateWhy varchar(200) not null,
	StateTime smalldatetime not null
)

-- 420117200206130810
-- 234523453452345344
-- 345342345234523534
insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
values('420117200206130810','18040503044','江开',GETDATE())
insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
values('6223234234234423',1,'123456',0,1)

insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
values('234523453452345344','16543403044','关羽',GETDATE())
insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
values('6223654334234423',1,'123456',0,1)

insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
values('345342345234523534','13453403044','张飞',GETDATE())
insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
values('6223632423453345',1,'123456',0,1)


select *from AccountInfo
select *from BankCard
select *from CardExchange

-- 进行存钱操作，江开存钱5000000元，关羽存钱8000，张飞存钱5000
update BankCard set CardMoney = CardMoney + 5000000 where CardNo = '6223234234234423'
insert into CardExchange(CardNo,MoneyInBank,MoneyOutBank,ExchangeTime)
values('6223234234234423',5000000,0,GETDATE())

update BankCard set CardMoney = CardMoney + 8000 where CardNo ='6223654334234423'
insert into CardExchange(CardNo,MoneyInBank,MoneyOutBank,ExchangeTime)
values('6223654334234423',8000,0,GETDATE())

update BankCard set CardMoney = CardMoney + 5000 where CardNo ='6223632423453345'
insert into CardExchange(CardNo,MoneyInBank,MoneyOutBank,ExchangeTime)
values('6223632423453345',5000,0,GETDATE())


-- 江开给张飞转账10000
update BankCard set CardMoney = CardMoney - 10000 where CardNo = '6223234234234423'
update BankCard set CardMoney = CardMoney + 10000 where CardNo = '6223632423453345'
insert into CardTransfer(CardNoOut,CardNoIn,TransferMoney,TransferTime)
values('6223234234234423','6223632423453345',10000,GETDATE())
```

# 十一、变量和go

```sql
-- 打印
print '我瞎混'
select  '我瞎混'

use Bank
go
-- 变量
-- 局部变量 - 先声明再使用，@开头
select *from AccountInfo
select *from BankCard
declare @AccountId int
select @AccountId = 
(select AccountId from AccountInfo where AccountCode = '420117200206130810')

select CardNo 卡号,CardMoney 余额 from BankCard
where AccountId = @AccountId
-- set 和 select 进行赋值的区别
-- set 适合赋值指定的值
-- select 适合用于表中查询出的数据赋值给变量，多条取最后一条


-- 全局变量： 以@@开头，由系统进行定义和维护
-- @@error ：返回执行的上一个语句的错误
-- @@identity ： 返回最后插入的标识值
-- @@max_connections ：返回允许同时进行的最大用户连接数
-- @@rowcount ： 返回受上一语句影响的行数
-- @@servername ： 返回运行SQL Server的本地服务器的名称
-- @@servicename ： 返回SQL Server正在其下运行的注册表项的名称
-- @@trancount ： 返回当前连接的活动事务数
-- @@lock_timeout ： 返回当前会话的当前锁定超时设置（毫秒）


go
-- 为赵云开卡
insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
values('453646342352343452','15207472323','赵云',GETDATE())
declare @AccountId int
set @AccountId = @@identity
insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
values('6226547544234423',@AccountId,'123456',0,1)
-- accountid并不确定，所以用变量

select *from AccountInfo
select *from BankCard

-- 求出张飞的卡号和余额，张飞的身份证：345342345234523534
go -- 避免重复变量
declare @AccountId int
select @AccountId = 
(select AccountId from AccountInfo where AccountCode = '345342345234523534')

select CardNo 卡号, CardMoney 余额 from BankCard
where AccountId = @AccountId


-- go语句

-- 1，会等待go语句之前代码执行完再执行下面的
-- 2，批量处理结束的一个标志

```

# 十二、运算符

![image-20231027132446139](C:\Users\江开\Documents\Typora文档\vue的学习\SQL Server.assets\image-20231027132446139.png)

```sql
use Bank
go

-- 计算出长方形的周长，面积
declare @c int = 10
declare @k int = 5
declare @zc int
declare @mj int
set @zc = (@c+@k)*2
set @mj = (@c*@k)
print @zc -- 可以，但是和字符串一起不行
-- print '周长为：'+ @zc 报错
print '周长为：'+ convert(varchar(10),@zc) -- 二选一
print '面积为：'+ cast(@mj as varchar(10))


-- 给江开开卡，最多三张
declare @AccountId int
declare @CardCount int
if EXISTS(select * from AccountInfo where AccountCode = '420117200206130810')
	begin
		select @AccountId = 
		(select AccountId from AccountInfo where AccountCode = '420117200206130810')

		-- 如果这个人卡又三张就不能办了
		select @CardCount = -- 查出这个人多少张卡
		(select count(*) from BankCard where AccountId = @AccountId)

		if @CardCount<=2
			begin
				insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
				values('62232423423425',@AccountId,'123456',0,1)
			end
		else
			begin
				print'你的卡已经有三张了'
			end
	end
else -- 不存在此人
	begin
		-- 先给人录入信息
		insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
		values('420117200206130810','18040503044','江开',getdate())
		-- 再给人开卡
		set @AccountId = @@identity
		insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
		values('62232423423425',@AccountId,'123456',0,1)
	end


-- 查询是不是所有人的余额都大于3000
if 3000<all(select CardMoney from BankCard)
	begin
		print'yes'
	end
else
	begin
		print'no'
	end

-- 查询有没有人余额超过100000
if 100000<any(select CardMoney from BankCard)
	begin
		print'yes'
	end
else
	begin
		print'no'
	end

```

# 十三、流程控制

```sql
-- 查询银行卡信息，讲银行卡状态1,2,3,4分别转换文字
-- 正常 挂失 冻结 注销
-- 30万以下普通用户，30万以上vip
-- 显示卡号，身份证，姓名，余额，用户等级，银行卡状态

select CardNo 卡号, AccountCode 身份证,RealName 姓名,CardMoney 余额,
case
	when CardMoney>=300000 then 'vip用户'
	else '普通用户'
end 用户等级,
case CardState  -- 相同的字段等于 可以这样写
	when 1 then '正常'
	when 2 then '挂失'
	when 3 then '冻结'
	when 4 then '注销'
end 卡状态
from BankCard
inner join AccountInfo on BankCard.AccountId = AccountInfo.AccountId


-- 循环结构
-- 输出99乘法表
declare @i int =1
declare @str varchar(1000) = '' -- 将一行存入字符串
while @i<=9
	begin
		declare @j int =1
		while @j<=@i
			begin
				set @str = @str+cast(@i as varchar(1))+'*'
				+cast(@j as varchar(1))
				+'='+cast(@i*@j as varchar(2))+char(9) 
				-- 制表符，10 是换行
				set @j += 1
			end
		set @i +=1
		print @str
		set @str = ''
	end
```

# 十四、子查询

可以作为查询的条件，也可以作为临时表进行多表查询

```sql
-- 子查询
use Bank
go

select * from BankCard
select * from AccountInfo

-- 查询出余额比关羽多的银行卡信息，显示卡号，身份证，姓名，余额
select CardNo 卡号,AccountCode 身份证,RealName 姓名,CardMoney 余额  from BankCard
inner join AccountInfo on AccountInfo.AccountId = BankCard.AccountId
where  CardMoney >
(select CardMoney from BankCard where CardNo = '6223632423453345') -- 子查询

-- 所有账户信息中查询出余额最高的人的交易明细
select * from CardExchange where 
CardNo = (select top 1 CardNo from BankCard order by CardMoney desc)
-- 如果多个人余额一样，都是最高，都要查出来
select * from CardExchange where CardNo in
-- 用in 包含关系
(select  CardNo from BankCard where CardMoney = 
(select max(CardMoney) from BankCard))

-- 查询有存款记录的银行卡信息，显示卡号，身份证，姓名，余额
select CardNo 卡号,AccountCode 身份证,RealName 姓名,CardMoney 余额  from BankCard
inner join AccountInfo on AccountInfo.AccountId = BankCard.AccountId
where CardNo in 
(select CardNo from CardExchange where MoneyInBank > 0)


-- 关羽的银行卡号为'6223632423453345',查询当天是否收到转账
if exists(select * from CardTransfer where CardNoIn = '6223632423453345' and
convert(varchar(22),getdate(),23) = convert(varchar(22),TransferTime,23))
	begin
		print '有'
	end
else
	begin
		print '无'
	end


-- 查询出交易次数最多的银行卡信息，显示卡号和交易次数
select BankCard.CardNo 卡号 , temp.paycount 交易次数  from BankCard
-- inner join AccountInfo on AccountInfo.AccountId = BankCard.AccountId
inner join
(select CardExchange.CardNo,count(*) paycount from CardExchange group by CardNo) temp
on BankCard.CardNo = temp.CardNo
where temp.paycount = 
(select max(paycount) from 
	(select count(*) paycount from CardExchange group by CardNo) temp2-- 必须有别名
)

-- 查询出没有转账记录的银行卡账户信息
select CardNo 卡号,AccountCode 身份证,RealName 姓名,CardMoney 余额  from BankCard
inner join AccountInfo on AccountInfo.AccountId = BankCard.AccountId
where CardNo not in (select CardNoIn from CardTransfer)
and CardNo not in (select CardNoOut from CardTransfer)
```

# 十五、分页*

```sql
create table Student
(
	StuId int primary key identity(1,2),
	StuName varchar(10),
	StuSex nchar(1)
)

insert into Student(StuName,StuSex)values('刘备','男')
insert into Student(StuName,StuSex)values('刘也','男')
insert into Student(StuName,StuSex)values('刘有','男')
insert into Student(StuName,StuSex)values('刘人','男')
insert into Student(StuName,StuSex)values('刘看','男')
insert into Student(StuName,StuSex)values('刘额','男')
insert into Student(StuName,StuSex)values('刘的','男')
insert into Student(StuName,StuSex)values('娃儿','男')
insert into Student(StuName,StuSex)values('娃儿','男')
insert into Student(StuName,StuSex)values('个地','男')
insert into Student(StuName,StuSex)values('就好','男')
insert into Student(StuName,StuSex)values('让他','男')
insert into Student(StuName,StuSex)values('额外','男')
insert into Student(StuName,StuSex)values('一样','男')
insert into Student(StuName,StuSex)values('回家','男')
insert into Student(StuName,StuSex)values('就好','男')
insert into Student(StuName,StuSex)values('让他','男')
insert into Student(StuName,StuSex)values('二额','男')
insert into Student(StuName,StuSex)values('问问','男')
insert into Student(StuName,StuSex)values('千万','男')
insert into Student(StuName,StuSex)values('但是','男')
insert into Student(StuName,StuSex)values('就好','男')
insert into Student(StuName,StuSex)values('是的','男')
insert into Student(StuName,StuSex)values('挺让','男')
insert into Student(StuName,StuSex)values('二样','男')
insert into Student(StuName,StuSex)values('二家','男')

select * from Student

-- 方法一：
-- 排除前10个人后的前五个人就是第三页
select top 5 * from Student
where StuId not in (select top 10 StuId from Student)


select top 每页的数量 * from Student
where StuId not in (select top 每页的数量 * (当前页 - 1) StuId from Student)

declare @Pagesize int =5
declare @Pageindex int = 2
select top (@Pagesize) * from Student -- top后面如果是变量需要打括号
where StuId not in (select top((@Pagesize) * (@Pageindex - 1)) StuId from Student)


-- 方法二：创建一个临时表，为其顺序排序
select * from
(Select row_number()over(order by StuId) rowId,* from student) Temp -- 临时表
where rowId between (当前页 -1)*每页的数量 +1 and 当前页*每页的大小
go

declare @Pagesize int =5
declare @Pageindex int = 3
select * from
(Select row_number()over(order by StuId) rowId,* from student) Temp -- 临时表
where rowId between (@Pageindex-1)*@Pagesize+1 and @Pageindex*@Pagesize

```

# 十六、事务

```sql
use Bank
go

-- 事务
select AccountInfo.RealName, * from BankCard
inner join AccountInfo on BankCard.AccountId = AccountInfo.AccountId
select *from CardTransfer


-- 张飞给赵云转10000块钱
begin transaction
declare @TotalErr int = 0
update BankCard set CardMoney = CardMoney + 30000 where CardNo = '6226547544234423'
set @TotalErr = @TotalErr + @@ERROR-- 记录错误编号，没有错误就为0
update BankCard set CardMoney = CardMoney - 30000 where CardNo = '6223654334234423'
set @TotalErr = @TotalErr + @@ERROR
insert into CardTransfer(CardNoOut,CardNoIn,TransferMoney,TransferTime)
values('6223654334234423','6226547544234423',30000,GETDATE())
set @TotalErr = @TotalErr + @@ERROR

if @TotalErr = 0
	begin
		commit transaction
		print '转账成功'
	end
else
	begin
		rollback transaction
		print '转账失败'
	end
```

# 十七、索引

```sql
-- 索引
-- 聚集索引：对磁盘数据重新组织按指定一列或多列排序（类似字典abcd）
-- 非聚集索引：类似于偏旁部首索引
-- 又可分唯一索引和非唯一索引

select * from AccountInfo where AccountCode = '420117200206130810'

-- 给AccountCode添加索引
create unique nonclustered index index_code
on AccountInfo(AccountCode)

-- 索引查看（sys.indexes）
select * from sys.indexes where name = 'index_code'

-- 删除索引
drop index index_code on AccountInfo

-- 显示指定索引进行查询
select * from AccountInfo with(index = index_code)
where AccountCode = '420117200206130810'

-- with里面可以填写很多很多项，详情未讲
```

# 十八、视图

将常用的查询创建一个视图，以便于查找，但是不建议在视图里面修改数据

```sql
create view View_Account_Card -- 视图名称
as
select CardNo... from ...
go

-- 以后查询这个视图
select * from View_Account_Card

--删除
drop view View_Account_Card
```

# 十九、游标

```sql

-- 游标 - 定位到结果集中的某一行

-- 静态游标（static）：数据发生变化，游标中的数据不会变化
-- 动态游标（dynamic）：数据变化，游标中的数据变化
-- 键集驱动游标（keyset）：被标识的列发生变化，游标中的数据变化，其他列变化，游标中的数据不变

select * from Student

-- 多列

-- 创建游标（scroll）滚动游标，可逆的，可以向上向下
declare mycur cursor scroll
for select StuId,StuName,StuSex from Student
-- 打开游标
open mycur

-- 使用
fetch first from mycur  -- 第一行
fetch last from mycur  -- 最后行
fetch absolute 2 from mycur  -- 第二行
fetch relative 2 from mycur  -- 当前行下移两行
fetch next from mycur  -- 下移一行
fetch prior from mycur  -- 上移一行

-- 提取游标数据存入变量，进行查询所有列信息
declare @id int
declare @name varchar(10)
declare @sex varchar(10)
fetch absolute 2 from mycur into @id,@name,@sex
select * from student where StuId = @id

-- 遍历
go
declare @id varchar(10)
declare @name varchar(10)
declare @sex varchar(10)
fetch absolute 1 from mycur into @id,@name,@sex
-- @@fetch_status = 0 提取成功，-1失败， -2 不存在
while @@fetch_status = 0
	begin
		print 'id:'+@id+',name:'+@name + ',sex:' + @sex
		fetch next from mycur into @id,@name,@sex
	end


-- 利用游标进行数据的修改和删除
select * from Student
fetch absolute 2 from mycur
update student set StuName = '江开' where current of mycur -- 游标指的这一行

-- 删除这一列的游标
fetch absolute 2 from mycur
delete from student where current of mycur

-- 关闭游标
close mucur
-- 删除游标
deallocate mycur
```

# 二十、函数

函数 - 1

```sql
use Bank
go

-- 函数 （系统函数和自定义函数）
-- 标量值函数   返回单个值
-- 表值函数  返回查询结果

-- 1、编写一个函数求银行的金额总数
-- 创建函数
create function GetSumMoney() returns money -- 返回类型为money
as
	begin
		declare @sum money
		select @sum = (select sum(CardMoney) from BankCard)
		return @sum
	end

-- 删除函数
drop function GetSumMoney

-- 函数调用
print dbo.GetSumMoney()
select dbo.GetSumMoney()

--传入账户编号，返回账户真实姓名

create function getName(@id int) returns varchar(20)
as
begin
	declare @name varchar(20)
	select @name = (select RealName from AccountInfo where AccountId = @id)
	return @name
end

print dbo.getName(1)

-- 传递开始和结束时间，返回交易记录。包含真实姓名，卡号，存钱金额，取钱金额，交易时间
-- 方案一（可以在里面进行一些逻辑代码操作）
create function getExchange(@start varchar(20),@end varchar(20))
returns @result table
(
	RealName varchar(20),
	CardNo varchar(20),
	MoneyInBank money,
	MoneyOutBank money,
	ExchangeTime smalldatetime 
)
as
begin
insert into @result
	select RealName , CardExchange.CardNo, MoneyinBank,MoneyOutBank,ExchangeTime from CardExchange
	inner join BankCard on BankCard.CardNo = CardExchange.CardNo
	inner join AccountInfo on AccountInfo.AccountId = BankCard.AccountId
	where ExchangeTime between  @start and @end
	return -- 将这个被插入的表进行返回
end

select * from getExchange('1990-10-10','2024-10-10')

-- 方案二（只能在里面写return+sql查询语句）
drop function getExchange
create function getExchange(@start varchar(20),@end varchar(20))
returns  table
as
	return
	select RealName , CardExchange.CardNo, MoneyinBank,MoneyOutBank,ExchangeTime from CardExchange
	inner join BankCard on BankCard.CardNo = CardExchange.CardNo
	inner join AccountInfo on AccountInfo.AccountId = BankCard.AccountId
	where ExchangeTime between  @start and @end
go

select * from getExchange('1990-10-10','2024-10-10')
```

# 二一、安全控制

```sql
-- 成功登录到sql server服务器，登录名管理
create login manager with password = '123456'

-- 成为数据库的合法用户，用户身份
use student
create user man for login manager
grant select,update(StuName) on student to man -- 用户才是权限的载体，用户名/角色名/public/用户组
revoke update(StuName) on student from man

-- 拥有存取权限  角色role，如果权限比较多可以给角色
create role boss
grant select on student to boss
exec sp_addrolemember boss,man
exec sp_droprolemember boss,man
```

# 二二、存储过程

```sql
-- 传参类型，不传参的差不多，就不写了
-- 模拟银行卡存钱操作，传入银行卡，存钱金额，实现存钱操作
create proc pro_Cunqian
@CardNo varchar(30),
@money money
as
 -- 里面应该写事务，确保完整性
 update BankCard set CardMoney = CardMoney + @money
 where CardNo = @CardNo
 insert into CardExchange values(@CardNo,@money,0,GETDATE())
go
select * from BankCard
select * from CardExchange

-- 使用存储过程
exec pro_Cunqian '62232423423423',1000

-- 删除存储过程
drop proc pro_Cunqian
go


-- 取钱，带返回值的
-- 取钱成功返回1，取钱失败返回-1
create proc pro_Quqian
@CardNo varchar(30),
@money money
as
 update BankCard set CardMoney = CardMoney - @money
 where CardNo = @CardNo
 -- 如果钱不够会报错
 if @@ERROR <> 0
  return -1
 insert into CardExchange values(@CardNo,0,@money,GETDATE())
  return 1
go

declare @returnvalue int 
exec @returnvalue = pro_Quqian '62232423423423',200
print @returnvalue


-- 返回数据类  可以返回多个参数
-- 传入开始和结束时间，查询时间段内的交易记录，并且带回存款、取款总金额
go
-- drop proc pro_selectExchange
create proc pro_selectExchange
@start smalldatetime,
@end smalldatetime,
@sumIn money output,
@sumOut money output -- 输出参数
as
 select @sumIn = (select sum(MoneyInBank) from CardExchange
   where ExchangeTime between @start+'00:00:00' and @end + '23:59:59')
 select @sumOut = (select sum(MoneyOutBank) from CardExchange
   where ExchangeTime between @start+'00:00:00' and @end + '23:59:59')
 select * from CardExchange
   where ExchangeTime between @start+'00:00:00' and @end + '23:59:59'
go

select * from CardExchange

declare @sumIn money
declare @sumOut money -- 输出参数
exec pro_selectExchange '2023-1-1','2023-12-12',@sumIn output,@sumOut output

-- 同时输入输出的参数 
-- 在别的数据库里面有input，在sql中，用output
-- 如果我们传的参数本身不带值，那么就是一个输出参数
-- 如果我们传的参数本身有值，传过去又传回来，就是一个同时输入输出的存储过程


```

