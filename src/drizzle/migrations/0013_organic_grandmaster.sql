DROP INDEX "name_search_index";--> statement-breakpoint
CREATE INDEX "name_search_index" ON "professionals" USING gin ("name" gin_trgm_ops);