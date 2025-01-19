CREATE TYPE "public"."complexity" AS ENUM('simple', 'moderate', 'complex', 'very complex');--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"professional" text,
	"country" text,
	"overallRating" integer NOT NULL,
	"valueRating" integer NOT NULL,
	"complexity" "complexity" NOT NULL,
	"useAgain" boolean NOT NULL,
	"comment" text,
	CONSTRAINT "reviews_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "professionals" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_professional_professionals_id_fk" FOREIGN KEY ("professional") REFERENCES "public"."professionals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_country_countries_code_fk" FOREIGN KEY ("country") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_country_countries_code_fk" FOREIGN KEY ("country") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;