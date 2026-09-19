package com.example.demo.repository;

import com.example.demo.entity.Todo;
import com.example.demo.mybatis.externalsql.ExternalSqlProvider;
import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Mapper
public interface TodoRepository {

    @SelectProvider(ExternalSqlProvider.class)
    List<Todo> findAll();

    @SelectProvider(ExternalSqlProvider.class)
    Optional<Todo> findById(@Param("id") Long id);

    @SelectProvider(value = ExternalSqlProvider.class, affectData = true)
    Todo insert(
            @Param("title") String title,
            @Param("detail") String detail,
            @Param("isCompleted") Boolean isCompleted,
            @Param("createdAt") OffsetDateTime createdAt,
            @Param("updatedAt") OffsetDateTime updatedAt
    );

    @SelectProvider(value = ExternalSqlProvider.class, affectData = true)
    Optional<Todo> update(
            @Param("id") Long id,
            @Param("title") String title,
            @Param("detail") String detail,
            @Param("isCompleted") Boolean isCompleted,
            @Param("updatedAt") OffsetDateTime updatedAt
    );

    @DeleteProvider(ExternalSqlProvider.class)
    int deleteById(@Param("id") Long id);
}
