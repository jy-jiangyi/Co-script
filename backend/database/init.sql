Drop table if exists scripts_relation;
Drop table if exists script_scenes;
Drop table if exists context_reference;
Drop table if exists context;
Drop table if exists scripts_creation;
Drop table if exists scripts;
Drop table if exists users;

-- create table users
Create table users
(
    id            BIGINT       NOT NULL AUTO_INCREMENT, -- auto increment,
    email         VARCHAR(128) NOT NULL,
    name          VARCHAR(64)  NOT NULL,
    role          CHAR(32)     NOT NULL,
    password_hash CHAR(64)     NOT NULL,
    create_time   datetime,
    update_time   datetime,
    PRIMARY KEY (id)
);

CREATE TRIGGER before_insert_users
    BEFORE INSERT
    ON users
    FOR EACH ROW SET NEW.create_time = NOW();

-- 创建 before update 触发器，设置 updatetime
CREATE TRIGGER before_update_users
    BEFORE UPDATE
    ON users
    FOR EACH ROW SET NEW.update_time = NOW();

-- 创建脚本表
CREATE TABLE scripts
(
    id          BIGINT  NOT NULL AUTO_INCREMENT, -- auto increment
    creator     BIGINT  NOT NULL, -- 外键，指向用户表
    name CHAR(50) NOT NULL,       -- 脚本名称
    create_time DATETIME,         -- 创建时间
    update_time DATETIME,         -- 更新时间
    PRIMARY KEY (id), -- primary key
    FOREIGN KEY (creator) REFERENCES users(id)
);

-- 创建 before insert 触发器，设置 create_time
CREATE TRIGGER before_insert_script
    BEFORE INSERT
    ON scripts
    FOR EACH ROW SET NEW.create_time = NOW();

-- 创建 before update 触发器，设置 update_time
CREATE TRIGGER before_update_script
    BEFORE UPDATE
    ON scripts
    FOR EACH ROW SET NEW.update_time = NOW();

CREATE TABLE script_scenes
(
    id          BIGINT   NOT NULL AUTO_INCREMENT,   -- 主键，自增
    script_id   BIGINT   NOT NULL,                  -- 外键，指向脚本表
    scene       INT      NOT NULL,                  -- 场次
    content     TEXT     NOT NULL,                  -- 场次内容
    create_time DATETIME,                           -- 创建时间
    update_time DATETIME,                           -- 更新时间
    title       CHAR(50) NOT NULL,                  -- 场次标题
    PRIMARY KEY (id),                               -- 主键
    FOREIGN KEY (script_id) REFERENCES scripts (id) -- link this table to script table
);

-- 创建 before insert 触发器，设置 create_time
CREATE TRIGGER before_insert_script_scenes
    BEFORE INSERT
    ON script_scenes
    FOR EACH ROW SET NEW.create_time = NOW();

-- 创建 before update 触发器，设置 update_time
CREATE TRIGGER before_update_script_scenes
    BEFORE UPDATE
    ON script_scenes
    FOR EACH ROW SET NEW.update_time = NOW();

CREATE TABLE scripts_creation
(
    id          BIGINT   NOT NULL AUTO_INCREMENT,   -- Primary key, auto-increment
    positive    TEXT     NOT NULL,                   -- Positive text, cannot be null
    negative    TEXT     NOT NULL,                   -- Negative text, cannot be null
    script_id   BIGINT      NOT NULL,                   -- Foreign key, cannot be null
    PRIMARY KEY (id),                                -- Primary key
    FOREIGN KEY (script_id) REFERENCES scripts (id) -- Link this table to script table
);

-- create table context
CREATE TABLE context
(
    id          BIGINT   NOT NULL AUTO_INCREMENT,   -- primary key, auto_increment
    title       CHAR(50) NOT NULL,                  -- title
    description    CHAR(50) NOT NULL,               -- description
    positive    TEXT     NOT NULL,                   -- positive context
    negative    TEXT     NOT NULL,                   -- negative context
    creator     BIGINT   NOT NULL,                  -- creator, which is a foreign key                       -- update_time
    PRIMARY KEY (id),
    FOREIGN KEY (creator) REFERENCES users (id)     -- link this table to users table
);


-- create table context reference
Create table context_reference(
    id  BIGINT  NOT NULL AUTO_INCREMENT,
    script_id BIGINT NOT NULL ,
    context_id BIGINT NOT NULL ,
    PRIMARY KEY (id),
    FOREIGN KEY (script_id) REFERENCES scripts(id),
    FOREIGN KEY (context_id) REFERENCES context(id)
);

-- create table scripts relation
Create table scripts_relation(
    id BIGINT NOT NULL AUTO_INCREMENT,
    parent_id BIGINT NOT NULL,
    child_id BIGINT NOT NULL,
    relation char(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id) REFERENCES scripts(id),
    FOREIGN KEY (child_id) REFERENCES scripts(id)
);

