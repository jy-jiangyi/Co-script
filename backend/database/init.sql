Drop table if exists users;
Drop table if exists context_reference;
Drop table if exists scripts_relation;

Create table users(
    id BIGINT,
    email VARCHAR(128) NOT NULL,
    name VARCHAR(64) NOT NULL,
    role INT NOT NULL,
    password_hash CHAR(64) NOT NULL,
    create_time datetime,
    update_time datetime,
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
    BEFORE INSERT ON users
    FOR EACH ROW
    SET NEW.create_time = NOW();

-- 创建 before update 触发器，设置 updatetime
CREATE TRIGGER before_update_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    SET NEW.update_time = NOW();