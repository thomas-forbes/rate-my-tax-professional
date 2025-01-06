CREATE VIEW "public"."countries_with_stats" AS (
    SELECT 
      c.code,
      c.name,
      COUNT(p.id) as "numberOfProfessionals"
    FROM countries c
    LEFT JOIN professionals p ON c.code = p.country
    GROUP BY c.code, c.name
  );