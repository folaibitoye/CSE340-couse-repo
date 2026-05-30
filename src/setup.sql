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
VALUES (
        'BrightFuture Builders',
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
        'info@brightfuturebuilders.org',
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers',
        'An urban farming collective promoting food sustainability and education in local neighborhoods.',
        'contact@greenharvest.org',
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers',
        'A volunteer coordination group supporting local charities and service initiatives.',
        'hello@unityserve.org',
        'unityserve-logo.png'
    );
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);
-- 2. Create the Junction Table for the many-to-many relationship
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    -- Composite Primary Key ensures a project can't be added to the same category twice
    CONSTRAINT pk_project_categories PRIMARY KEY (project_id, category_id),
    -- Foreign Keys maintain referential integrity
    -- ON DELETE CASCADE ensures if a project or category is deleted, the link is removed automatically
    CONSTRAINT fk_pc_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);
INSERT INTO categories (name)
VALUES ('Community Outreach'),
    ('Environmental Sustainability'),
    ('Disaster Relief');
-- Let's assume:
-- Project 1 = "Local Food Bank Drive"
-- Project 2 = "City Park Reforestation"
-- Project 3 = "Crisis Shelter Tech Setup"
INSERT INTO project_categories (project_id, category_id)
VALUES -- Food drive belongs to Community Outreach
    (1, 1),
    -- Reforestation belongs to Environmental Sustainability
    (2, 2),
    -- Crisis Shelter Tech belongs to BOTH Community Outreach and Disaster Relief
    (3, 1),
    (3, 3);
-- ========================================
-- Projects Table (Must exist BEFORE the junction table!)
-- ========================================
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    organization_id INT NOT NULL,
    -- Foreign key linking back to your organization table
    CONSTRAINT fk_project_organization FOREIGN KEY (organization_id) REFERENCES organization(organization_id) ON DELETE CASCADE
);
-- ========================================
-- Insert Sample Data: Projects
-- ========================================
INSERT INTO projects (
        title,
        description,
        date,
        location,
        organization_id
    )
VALUES (
        'Local Food Bank Drive',
        'Help collect and distribute food items to families in need across our local neighborhoods.',
        CURRENT_DATE + INTERVAL '5 days',
        'Community Center East',
        3
    ),
    (
        'City Park Reforestation',
        'Join our team to plant new native trees and clean up trash to revitalize our downtown ecosystem.',
        CURRENT_DATE + INTERVAL '12 days',
        'Central Green Park',
        2
    ),
    (
        'Crisis Shelter Tech Setup',
        'Volunteer to help set up internet access points and workstations for a new local youth shelter.',
        CURRENT_DATE + INTERVAL '20 days',
        'Downtown Hope Center',
        1
    );
-- ========================================
-- Fix for the Categories Insert Typo
-- ========================================
-- Your original script used "name", but your table definition uses "category_name"
INSERT INTO categories (category_name)
VALUES ('Community Outreach'),
    ('Environmental Sustainability'),
    ('Disaster Relief');