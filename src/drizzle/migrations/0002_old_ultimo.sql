DROP VIEW "public"."professionals_with_stats";--> statement-breakpoint
CREATE VIEW "public"."professionals_with_stats" AS (
    SELECT 
      p.*,
      COALESCE(AVG(r."overallRating")::numeric(10,2), 0) as rating,
      COUNT(r.id) as "reviewCount",
      CASE 
        WHEN COUNT(r.id) > 0 
        THEN (SUM(CASE WHEN r."useAgain" THEN 1 ELSE 0 END)::float / COUNT(r.id) * 100)::numeric(10,2)
        ELSE 0 
      END as "useAgainPercent"
    FROM professionals p
    LEFT JOIN reviews r ON p.id = r."professionalId"
    GROUP BY p.id, p.name, p.credential, p.address, p.country
  );