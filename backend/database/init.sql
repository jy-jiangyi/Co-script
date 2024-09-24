Drop table if exists users;
Drop table if exists context_reference;
Drop table if exists scripts_relation;

Create table users
(
    id            BIGINT,
    email         VARCHAR(128) NOT NULL,
    name          VARCHAR(64)  NOT NULL,
    role          INT          NOT NULL,
    password_hash CHAR(64)     NOT NULL,
    create_time   datetime,
    update_time   datetime,
    PRIMARY KEY (id)
);

-- create table context reference
Create table context_reference(
    id BIGINT,
    script_id BIGINT NOT NULL ,
    context_id BIGINT NOT NULL ,
    PRIMARY KEY (id)
#     FOREIGN KEY (script_id) REFERENCES scripts(id),
#     FOREIGN KEY (context_id) REFERENCES context(id)
);

-- create table scripts relation
Create table scripts_relation(
    id BIGINT,
    parent_id BIGINT NOT NULL,
    child_id BIGINT NOT NULL,
    relation char(50) NOT NULL,
    PRIMARY KEY (id)
#     FOREIGN KEY (parent_id) REFERENCES scripts(id),
#     FOREIGN KEY (child_id) REFERENCES scripts(id)
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

DROP TABLE IF EXISTS scripts;

-- 创建脚本表
CREATE TABLE scripts
(
    id          BIGINT  NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 主键,自增
    creator     BIGINT  NOT NULL, -- 外键，指向用户表
    name CHAR(50) NOT NULL,       -- 脚本名称
    create_time DATETIME,         -- 创建时间
    update_time DATETIME,         -- 更新时间
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

DROP TABLE IF EXISTS script_scenes;

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
