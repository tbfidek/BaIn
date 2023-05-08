DROP table IF EXISTS nap_records;

CREATE TABLE nap_records (
    id SERIAL PRIMARY KEY,
    nap_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    sleep_quality VARCHAR(5) NOT NULL CHECK (sleep_quality IN ('Great', 'Fussy', 'Bad'))
);

INSERT INTO nap_records (nap_date, start_time, end_time, sleep_quality) VALUES
                                                                             ('2023-05-08', '14:00:00', '15:30:00', 'Great');