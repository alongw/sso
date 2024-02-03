```sql
create table configs
(
    id        int auto_increment
        primary key,
    `key`     varchar(255) not null,
    value     varchar(255) not null,
    createdAt datetime     not null,
    updatedAt datetime     not null
);
```

另外，需要手动创建一个 id 为 1 的用户组
