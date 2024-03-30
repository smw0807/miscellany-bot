import { registerAs } from '@nestjs/config';

export default registerAs('supabase', () => ({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_API_KEY,
  supabaseDiscordAuthUrl: process.env.SUPABASE_DISCORD_OAUTH2_URL,
}));
