-- CREATE TYPE "public"."complexity" AS ENUM('simple', 'moderate', 'complex', 'very complex');--> statement-breakpoint
-- CREATE TABLE "countries" (
-- 	"code" text PRIMARY KEY NOT NULL,
-- 	"name" text DEFAULT '' NOT NULL
-- );
--> statement-breakpoint
CREATE TABLE "professionals" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"credential" text,
	"address" text,
	"country" text,
	CONSTRAINT "professionals_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"professionalId" text,
	"country" text,
	"overallRating" integer NOT NULL,
	"valueRating" integer NOT NULL,
	"complexity" "complexity" NOT NULL,
	"useAgain" boolean NOT NULL,
	"comment" text,
	CONSTRAINT "reviews_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_country_countries_code_fk" FOREIGN KEY ("country") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_professionalId_professionals_id_fk" FOREIGN KEY ("professionalId") REFERENCES "public"."professionals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_country_countries_code_fk" FOREIGN KEY ("country") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "professionals_country_index" ON "professionals" USING btree ("country");--> statement-breakpoint
CREATE INDEX "reviews_professionalId_index" ON "reviews" USING btree ("professionalId");--> statement-breakpoint
CREATE VIEW "public"."professionals_with_stats" AS (
    SELECT 
      p.*,
      COALESCE(AVG(r."overallRating")::numeric(10,2), 0) as rating,
      COUNT(r.id) as reviewCount,
      CASE 
        WHEN COUNT(r.id) > 0 
        THEN (SUM(CASE WHEN r."useAgain" THEN 1 ELSE 0 END)::float / COUNT(r.id) * 100)::numeric(10,2)
        ELSE 0 
      END as useAgainPercent
    FROM professionals p
    LEFT JOIN reviews r ON p.id = r."professionalId"
    GROUP BY p.id, p.name, p.credential, p.address, p.country
  );
