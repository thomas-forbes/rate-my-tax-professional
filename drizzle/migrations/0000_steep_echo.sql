CREATE TABLE "countries" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professionals" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"credential" text,
	"address" text,
	CONSTRAINT "professionals_id_unique" UNIQUE("id")
);
