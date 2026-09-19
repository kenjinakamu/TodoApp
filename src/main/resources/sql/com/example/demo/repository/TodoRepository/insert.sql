INSERT INTO todo (title, detail, is_completed, created_at, updated_at)
VALUES (#{title}, #{detail}, #{isCompleted}, #{createdAt}, #{updatedAt})
RETURNING id,
          title,
          detail,
          is_completed AS "isCompleted",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
