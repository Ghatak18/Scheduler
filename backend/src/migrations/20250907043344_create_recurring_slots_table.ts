import { Knex } from "knex";
const dayEnumName = "day_of_week_enum";
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function up(knex: Knex): Promise<void> {
    //await knex.raw(`CREATE TYPE ${dayEnumName} AS ENUM (${daysOfWeek.map(day => `'${day}'`).join(', ')});`);
      await knex.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'day_of_week_enum') THEN
        CREATE TYPE day_of_week_enum AS ENUM (
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        );
      END IF;
    END $$;
  `);
    return knex.schema.createTable('recurring_slots', (table) => {
        table.increments('id').primary();
        table
            .enu("day_of_week",daysOfWeek,{
                useNative: true,
                enumName: dayEnumName,
                existingType: true
            }) 
            .notNullable// e.g., 'Monday', 'Tuesday'
        table.time('start_time').notNullable();
        table.time('end_time').notNullable();
        table.timestamps(true, true); // created_at and updated_at
    }); 
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('recurring_slots');
}
