DROP table IF EXISTS meal_records;

CREATE TABLE meal_records (
    id SERIAL PRIMARY KEY,
    meal_date DATE NOT NULL,
    meal_description VARCHAR(255) NOT NULL,
    meal_type VARCHAR(10) NOT NULL CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
    meal_option VARCHAR(8) NOT NULL CHECK (meal_option IN ('Liked', 'Disliked', 'Allergy'))
);

INSERT INTO meal_records (meal_date, meal_description, meal_type, meal_option) VALUES 
                                                                                 ('2023-05-08', 'Scrambled eggs and toast', 'Breakfast', 'Liked');