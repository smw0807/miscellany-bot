export type DiscordGuildsType = {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
  hasBot?: boolean;
};
