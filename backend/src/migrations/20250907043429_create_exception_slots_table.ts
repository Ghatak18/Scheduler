
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('exception_slots', (table) => {
        table.increments('id').primary();
        table.integer("original_recurring_slot_id").unsigned().references("id").inTable("recurring_slots").onDelete("CASCADE");
        table.date('date').notNullable(); // Specific date for the exception
        table.time('start_time').notNullable();
        table.time('end_time').notNullable();
        table.timestamps(true, true); // created_at and updated_at
    }); 
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('exception_slots');
}

