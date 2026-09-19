SELECT id,
       title,
       detail,
       is_completed AS "isCompleted",
       created_at AS "createdAt",
       updated_at AS "updatedAt"
  FROM todo
 WHERE id = #{id}
