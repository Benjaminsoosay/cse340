-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE NOT NULL,
    CONSTRAINT fk_project_organization FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Projects
-- ========================================
-- Projects for BrightFuture Builders (org_id = 1)
INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'Community Center Renovation', 'Renovating the downtown community center', '123 Main St, Springfield', '2025-06-15'),
(1, 'Park Bench Installation', 'Installing 20 new benches in Central Park', 'Central Park, Springfield', '2025-07-01'),
(1, 'Sidewalk Repair', 'Fixing cracked sidewalks in the historic district', 'Elm Street, Springfield', '2025-08-10'),
(1, 'Youth Shelter Painting', 'Painting and refreshing the local youth shelter', '456 Oak Ave, Springfield', '2025-09-05'),
(1, 'Community Garden Shed', 'Building a storage shed for the community garden', '789 Maple Dr, Springfield', '2025-10-12');

-- Projects for GreenHarvest Growers (org_id = 2)
INSERT INTO project (organization_id, title, description, location, date) VALUES
(2, 'Urban Farm Expansion', 'Adding two new raised beds at the urban farm', '321 Green St, Springfield', '2025-06-20'),
(2, 'Compost Workshop', 'Teaching residents how to compost at home', '111 Garden Ln, Springfield', '2025-07-18'),
(2, 'Seedling Distribution', 'Free seedling giveaway for local gardeners', '555 Berry Rd, Springfield', '2025-05-30'),
(2, 'School Garden Setup', 'Helping Jefferson Elementary start a vegetable garden', 'Jefferson Elementary, Springfield', '2025-08-22'),
(2, 'Farmers Market Booth', 'Running a booth at the Saturday farmers market', 'Market Square, Springfield', '2025-09-14');

-- Projects for UnityServe Volunteers (org_id = 3)
INSERT INTO project (organization_id, title, description, location, date) VALUES
(3, 'Food Drive Coordination', 'Organizing a city-wide food drive', '777 Unity Blvd, Springfield', '2025-06-25'),
(3, 'Senior Center Visit', 'Spending time with residents at the senior center', '222 Elder Ln, Springfield', '2025-07-09'),
(3, 'River Cleanup', 'Removing trash along the riverbank', 'Riverside Park, Springfield', '2025-08-01'),
(3, 'Backpack Stuffing', 'Filling backpacks with school supplies for kids', '888 Charity Ave, Springfield', '2025-08-15'),
(3, 'Holiday Gift Wrapping', 'Wrapping gifts for underprivileged families', '999 Santa Dr, Springfield', '2025-12-20');

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Insert categories with fixed IDs matching the values used in project_category
INSERT INTO category (category_id, name, description) VALUES
(1, 'Environment', 'Projects focused on environmental conservation and sustainability.'),
(2, 'Education', 'Projects that educate the community or support learning.'),
(3, 'Health', 'Projects promoting health and well-being.'),
(4, 'Community Development', 'Projects that strengthen and improve local communities.'),
(5, 'Youth', 'Projects specifically aimed at helping young people.');

-- Reset the sequence to continue after our manual inserts
SELECT setval('category_category_id_seq', (SELECT MAX(category_id) FROM category));

-- ========================================
-- Project-Category Junction Table
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_category_project FOREIGN KEY (project_id)
        REFERENCES project (project_id) ON DELETE CASCADE,
    CONSTRAINT fk_project_category_category FOREIGN KEY (category_id)
        REFERENCES category (category_id) ON DELETE CASCADE
);

-- ========================================
-- Assign categories to projects
-- ========================================

-- BrightFuture Builders projects
INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Community Center Renovation'
  AND c.name IN ('Education', 'Community Development');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Park Bench Installation'
  AND c.name IN ('Environment', 'Community Development');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Sidewalk Repair'
  AND c.name = 'Community Development';

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Youth Shelter Painting'
  AND c.name IN ('Youth', 'Community Development');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Community Garden Shed'
  AND c.name IN ('Environment', 'Community Development');

-- GreenHarvest Growers projects
INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Urban Farm Expansion'
  AND c.name IN ('Environment', 'Education');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Compost Workshop'
  AND c.name IN ('Education', 'Environment');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Seedling Distribution'
  AND c.name IN ('Environment', 'Education');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'School Garden Setup'
  AND c.name IN ('Education', 'Environment');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Farmers Market Booth'
  AND c.name = 'Community Development';

-- UnityServe Volunteers projects
INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Food Drive Coordination'
  AND c.name IN ('Health', 'Community Development');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Senior Center Visit'
  AND c.name IN ('Health', 'Community Development');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'River Cleanup'
  AND c.name IN ('Environment', 'Community Development');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Backpack Stuffing'
  AND c.name IN ('Education', 'Youth');

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM project p
CROSS JOIN category c
WHERE p.title = 'Holiday Gift Wrapping'
  AND c.name IN ('Health', 'Youth');

-- Optional: View the results
SELECT * FROM organization;
SELECT * FROM project;
SELECT * FROM category;
SELECT * FROM project_category ORDER BY project_id, category_id;