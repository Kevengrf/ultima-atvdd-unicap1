-- Exemplo de Script SQL para Inserir Dados no Supabase

-- IMPORTANTE:
-- As senhas para os usuários são 'password123'. Em um ambiente real, você deve
-- criptografar as senhas antes de inseri-las no banco de dados.
-- O `password_hash` abaixo é o hash de 'password123' gerado via bcrypt.
-- Certifique-se de que os IDs UUID gerados ou fornecidos aqui correspondam aos registros reais se você estiver referenciando-os.

-- Limpar tabelas existentes (opcional, para testes)
-- CUIDADO: Isso irá apagar TODOS os dados das tabelas!
-- DELETE FROM favorites;
-- DELETE FROM recipes;
-- DELETE FROM categories;
-- DELETE FROM users;

-- 1. Inserir Usuários
INSERT INTO users (id, name, email, password_hash) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alice Johnson', 'alice@example.com', '$2a$10$E9p3b5y.gC3e.3j.X.X.X.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'), -- password123
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Bob Smith', 'bob@example.com', '$2a$10$E9p3b5y.gC3e.3j.X.X.X.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')  -- password123
ON CONFLICT (email) DO NOTHING;

-- Verifique se os IDs dos usuários foram inseridos corretamente ou ajuste conforme necessário
-- SELECT id, email FROM users;


-- 2. Inserir Categorias
INSERT INTO categories (id, name) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Café da Manhã'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Almoço'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Jantar'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Sobremesas')
ON CONFLICT (name) DO NOTHING;

-- Verifique se os IDs das categorias foram inseridos corretamente ou ajuste conforme necessário
-- SELECT id, name FROM categories;


-- 3. Inserir Receitas
-- Referenciando IDs de usuários e categorias criados acima
INSERT INTO recipes (id, name, description, ingredients, instructions, user_id, category_id) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
 'Omelete Simples',
 'Uma omelete rápida e fácil para energizar o seu dia.',
 ARRAY['2 ovos', '1/4 xícara de leite', 'sal', 'pimenta', 'queijo (opcional)'],
 '1. Bata os ovos com leite, sal e pimenta. 2. Aqueça uma frigideira untada. 3. Despeje a mistura de ovos e cozinhe. 4. Adicione queijo se desejar. 5. Dobre e sirva.',
 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- ID do usuário Alice
 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13' -- ID da categoria Café da Manhã
 ),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
 'Salmão Assado com Aspargos',
 'Uma refeição saudável e deliciosa para o almoço ou jantar.',
 ARRAY['1 filé de salmão', '1 maço de aspargos', 'azeite', 'limão', 'alho picado'],
 '1. Tempere o salmão com sal, pimenta e alho. 2. Misture os aspargos com azeite e sal. 3. Asse o salmão e os aspargos a 200°C por 15-20 minutos. 4. Sirva com fatias de limão.',
 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', -- ID do usuário Bob
 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14' -- ID da categoria Almoço
 )
ON CONFLICT (id) DO NOTHING;

-- Verifique se os IDs das receitas foram inseridos corretamente ou ajuste conforme necessário
-- SELECT id, name, user_id, category_id FROM recipes;


-- 4. Inserir Favoritos
-- Associando receitas a usuários
INSERT INTO favorites (user_id, recipe_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'), -- Alice favorita Omelete Simples
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'), -- Bob favorita Omelete Simples
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a18')  -- Alice favorita Salmão Assado
ON CONFLICT (user_id, recipe_id) DO NOTHING;

-- Verifique as associações de favoritos
-- SELECT u.name AS user_name, r.name AS recipe_name
-- FROM favorites f
-- JOIN users u ON f.user_id = u.id
-- JOIN recipes r ON f.recipe_id = r.id;
