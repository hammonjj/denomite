export const PORT = parseInt(Deno.env.get('PORT') || '8080', 10);
export const USE_TEST_DB = Deno.env.get('USE_TEST_DB') === 'true';
