insert into public.guilds (name, description, emblem_url) values
('The Forgemasters'' Syndicate', 'Masters of iron, steel, and armor making.', 'https://api.dicebear.com/7.x/shapes/svg?seed=forge'),
('The Weavers'' Circle', 'Tailors of fine silks, cloaks, and leatherworking.', 'https://api.dicebear.com/7.x/shapes/svg?seed=weaver'),
('The Alchemists'' Pact', 'Brewers of rare potions and gatherers of herbs.', 'https://api.dicebear.com/7.x/shapes/svg?seed=potion'),
('The Arcane Scholars', 'Enchanters, spell-scribes, and runecrafters.', 'https://api.dicebear.com/7.x/shapes/svg?seed=arcane')
on conflict (name) do nothing;
