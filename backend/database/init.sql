Drop table if exists users;

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

CREATE TRIGGER before_insert_users
    BEFORE INSERT ON users
    FOR EACH ROW
    SET NEW.create_time = NOW();

-- 创建 before update 触发器，设置 updatetime
CREATE TRIGGER before_update_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    SET NEW.update_time = NOW();