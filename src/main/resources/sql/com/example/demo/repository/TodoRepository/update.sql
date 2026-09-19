UPDATE todo
   SET title = #{title},
       detail = #{detail},
       is_completed = #{isCompleted},
       updated_at = #{updatedAt}
 WHERE id = #{id}
RETURNING id,
          title,
          detail,
          is_completed AS "isCompleted",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
